"use server"

import { db } from "@/lib/db-client"
import { revalidatePath } from "next/cache"
import { writeFile, readFile, appendFile } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"
import { mkdir } from "fs/promises"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Debug log function that writes to file
async function debugLog(message: string) {
    const timestamp = new Date().toISOString()
    const logLine = `[${timestamp}] ${message}\n`
    console.log(message)
    try {
        await appendFile(join(process.cwd(), "debug-ai.log"), logLine)
    } catch (e) {
        // ignore
    }
}

export async function uploadContract(formData: FormData) {
    console.log("[Server] uploadContract called")
    const file = formData.get("file") as File
    const eventId = formData.get("eventId") as string
    console.log(`[Server] File: ${file?.name}, EventId: ${eventId}`)

    if (!file || !eventId) {
        console.error("[Server] Missing file or eventId")
        throw new Error("Missing file or eventId")
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", "contracts")
    await mkdir(uploadDir, { recursive: true })

    // Save file
    const fileName = `${randomUUID()}-${file.name}`
    const filePath = join(uploadDir, fileName)
    const publicPath = `/uploads/contracts/${fileName}`
    await writeFile(filePath, buffer)

    // Save to DB (Using DRAFT as ANALYZING doesn't exist in DB)
    const contract = await (db.contract.create as any)({
        data: {
            title: file.name.replace(/\.(pdf|docx|doc)$/i, ""),
            eventId: eventId,
            status: "DRAFT",
            versions: {
                create: {
                    versionNumber: 1,
                    filePath: publicPath,
                }
            }
        },
        include: {
            versions: true
        }
    })

    // Trigger analysis
    try {
        await analyzeContract(contract.id, filePath, publicPath)
    } catch (e) {
        console.error("Analysis failed:", e)
    }

    revalidatePath(`/dashboard/events/${eventId}`)
    return contract
}

export async function analyzeContract(contractId: string, filePath: string, publicPath: string) {
    console.log(`[AI] Analyzing contract ${contractId}...`)
    console.log(`[AI] File path: ${filePath}`)

    try {
        let text = ""
        const lowerPath = filePath.toLowerCase()
        console.log(`[AI] Lower path: ${lowerPath}`)

        if (lowerPath.endsWith(".pdf")) {
            try {
                await debugLog(`[AI] Processing PDF with pdf2json: ${filePath}`)
                const PDFParser = require("pdf2json")
                const pdfParser = new PDFParser(null, 1) // 1 = text content only

                text = await new Promise((resolve, reject) => {
                    pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)))
                    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                        resolve(pdfParser.getRawTextContent())
                    })
                    pdfParser.loadPDF(filePath)
                }) as string

                await debugLog(`[AI] PDF extracted successfully (${text.length} chars)`)
            } catch (pdfError: any) {
                await debugLog(`[AI] PDF parsing error: ${pdfError?.message}`)
                throw pdfError
            }
        } else if (lowerPath.endsWith(".docx")) {
            await debugLog(`[AI] Processing DOCX...`)
            const mammoth = require("mammoth")
            const result = await mammoth.extractRawText({ path: filePath })
            text = result.value
        } else if (lowerPath.endsWith(".doc")) {
            await debugLog("[AI] Skipping analysis for .doc file")
            return
        }

        if (!text || text.trim().length === 0) {
            console.log("[AI] No text extracted/empty content.")
            return
        }

        console.log(`[AI] Extracted ${text.length} characters of text`)

        // Initialize Gemini client (lazy initialization to ensure env vars are loaded)
        const apiKey = process.env.GOOGLE_API_KEY
        console.log(`[AI] Calling Gemini API with key: ${apiKey?.substring(0, 10)}...`)

        if (!apiKey) {
            console.error("[AI] ERROR: GOOGLE_API_KEY is not set!")
            return
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
        const prompt = `
            Analyze this event contract and extract key information into a JSON format.
            I need the following structure:
            {
                "summary": "Brief 2 sentence summary of what this contract is for",
                "important_dates": [{"date": "YYYY-MM-DD", "event": "description"}],
                "costs": [{"description": "item", "amount": "$0.00"}],
                "risks": ["list of potential risks, cancellation policies, or weird clauses"]
            }
            
            Return ONLY the valid JSON string, no markdown code blocks.
            Contract Text:
            ${text.substring(0, 30000)}
        `

        console.log(`[AI] Sending prompt (${prompt.length} chars)...`)
        const result = await model.generateContent(prompt)
        console.log(`[AI] Got response from Gemini`)
        const response = result.response
        let jsonStr = response.text()
        console.log(`[AI] Raw response: ${jsonStr.substring(0, 200)}...`)
        jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim()
        JSON.parse(jsonStr) // validate
        console.log(`[AI] JSON validated successfully`)

        // Save Analysis to File
        // We replace the extension with .json
        const jsonPath = filePath.replace(/\.(pdf|docx)$/i, ".json")
        await writeFile(jsonPath, jsonStr)
        console.log(`[AI] Saved analysis to ${jsonPath}`)

    } catch (error: any) {
        await debugLog(`[AI] Error analyzing contract: ${error?.message || String(error)}`)
        await debugLog(`[AI] Error stack: ${error?.stack}`)
        await debugLog(`[AI] Error name: ${error?.name}`)
        console.error(error) // Log raw error
    }
}

export async function getContractAnalysis(publicPath: string) {
    if (!publicPath) return null
    try {
        // Convert public path to file system path
        // e.g. /uploads/contracts/abc.pdf -> .../public/uploads/contracts/abc.json
        const jsonPath = join(process.cwd(), "public", publicPath.replace(/\.(pdf|docx|doc)$/i, ".json"))
        const fileContent = await readFile(jsonPath, "utf-8")
        return JSON.parse(fileContent)
    } catch (error) {
        return null
    }
}

export async function getDocxHtml(publicPath: string): Promise<string | null> {
    if (!publicPath) return null
    try {
        const mammoth = require("mammoth")
        const filePath = join(process.cwd(), "public", publicPath)
        const result = await mammoth.convertToHtml({ path: filePath })
        return result.value
    } catch (error) {
        console.error("[DOCX] Error converting to HTML:", error)
        return null
    }
}
