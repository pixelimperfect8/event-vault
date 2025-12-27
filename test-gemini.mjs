// Test Gemini API connection
import 'dotenv/config'
import { GoogleGenerativeAI } from "@google/generative-ai"

async function testGemini() {
    console.log("API Key:", process.env.GOOGLE_API_KEY?.substring(0, 15) + "...")

    if (!process.env.GOOGLE_API_KEY) {
        console.error("ERROR: GOOGLE_API_KEY not found in environment")
        return
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    try {
        console.log("Sending test prompt...")
        const result = await model.generateContent("Say hello in JSON format: {\"greeting\": \"...\"}")
        const response = result.response
        console.log("Response:", response.text())
        console.log("SUCCESS!")
    } catch (error) {
        console.error("ERROR:", error.message)
        console.error("Full error:", error)
    }
}

testGemini()
