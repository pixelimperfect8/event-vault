// Simple test to verify Gemini API works with the SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log("API Key (first 15 chars):", apiKey?.substring(0, 15));

    if (!apiKey) {
        console.error("GOOGLE_API_KEY not found!");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        console.log("Sending request to Gemini...");
        const result = await model.generateContent("Say hello in JSON format: {\"greeting\": \"...\"}");
        const response = result.response;
        console.log("Response:", response.text());
        console.log("SUCCESS!");
    } catch (error) {
        console.error("Error:", error.message);
        console.error("Full error:", error);
    }
}

test();
