"use server"

import { db } from "@/lib/db-client"
import { revalidatePath } from "next/cache"
import { writeFile, readFile } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"
import { mkdir } from "fs/promises"
// @ts-ignore
import pdf from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini
// Note: In production this should definitely use an env var. 
// For this debugging session, assuming env var issues, we might need to be careful.
// But ideally GOOGLE_API_KEY is available in the process env.
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

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
    const contract = await db.contract.create({
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
        // include: {
        //     versions: true
        // }
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

// @ts-ignore
import mammoth from "mammoth";

export async function analyzeContract(contractId: string, filePath: string, publicPath: string) {
    console.log(`[AI] Analyzing contract ${contractId}...`)

    try {
        let text = ""
        const lowerPath = filePath.toLowerCase()

        if (lowerPath.endsWith(".pdf")) {
            const dataBuffer = await readFile(filePath)
            const pdfData = await pdf(dataBuffer)
            text = pdfData.text
        } else if (lowerPath.endsWith(".docx")) {
            const result = await mammoth.extractRawText({ path: filePath })
            text = result.value
        } else if (lowerPath.endsWith(".doc")) {
            // Legacy doc files not supported for analysis
            console.log("[AI] Skipping analysis for .doc file")
            return
        }

        if (!text || text.trim().length === 0) {
            console.log("[AI] No text extracted/empty content.")
            return
        }

        // Call Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
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

        const result = await model.generateContent(prompt)
        const response = result.response
        let jsonStr = response.text()
        jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim()
        JSON.parse(jsonStr) // validate

        // Save Analysis to File
        // We replace the extension with .json
        const jsonPath = filePath.replace(/\.(pdf|docx)$/i, ".json")
        await writeFile(jsonPath, jsonStr)
        console.log(`[AI] Saved analysis to ${jsonPath}`)

    } catch (error) {
        console.error("[AI] Error analyzing contract:", error)
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
