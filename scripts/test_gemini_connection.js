
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ ERROR: VITE_GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`\n📡 Testing Connection to: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you online?");
        const response = await result.response;
        console.log(`✅ SUCCESS: ${modelName} is reachable.`);
        return true;
    } catch (error) {
        if (error.message.includes("404") || error.message.includes("not found")) {
            console.error(`❌ FAILURE: ${modelName} NOT FOUND (404).`);
        } else if (error.message.includes("403")) {
             // 403 means the model exists but keys are restricted (which is fine for CLI vs Web)
             // We treat this as "Model Exists" because if it didn't, it would be 404.
            console.log(`⚠️ SUCCESS (Permission): ${modelName} exists (403 Referrer/Key restriction).`);
            return true;
        } else {
            console.error(`❌ FAILURE: ${modelName} Error: ${error.message}`);
        }
        return false;
    }
}

async function run() {
    console.log("🔍 Diagnosing Gemini Model Availability (2.5 vs 3.0)...");
    
    // Test the Plan Maestro mandated model
    const v3Pro = await testModel("gemini-3-pro-preview");
    const v3Flash = await testModel("gemini-3-flash-preview");
    
    // Test the Email recommended model
    const v25Flash = await testModel("gemini-2.5-flash");
    
    console.log("\n--- DIAGNOSIS COMPLETE ---");
}

run();
