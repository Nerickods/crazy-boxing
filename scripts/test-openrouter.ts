
import 'dotenv/config';
import OpenAI from 'openai';

// Load env vars explicitly if not picked up automatically by dotenv
// (Assuming .env.local is where secrets are, but dotenv normally loads .env)
import fs from 'fs';
import path from 'path';

// Try to load .env.local manually for the script
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
    const envConfig = require('dotenv').parse(fs.readFileSync(envLocalPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

async function testOpenRouter() {
    console.log('🔍 Testing OpenRouter Connection...');
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error('❌ ERROR: OPENROUTER_API_KEY is missing in environment variables.');
        return;
    }

    console.log('✅ API Key found (starts with):', apiKey.substring(0, 10) + '...');

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Blackbird House Debug Script",
        }
    });

    try {
        console.log('🚀 Sending request to OpenRouter (openai/gpt-4o)...');
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o",
            messages: [
                { role: "user", content: "Ping. Are you online? Reply with just 'Pong'." }
            ],
        });

        console.log('✅ Response received:');
        console.log(completion.choices[0].message);
    } catch (error: any) {
        console.error('❌ OpenRouter Request Failed:');
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Full Error:', JSON.stringify(error, null, 2));
    }
}

testOpenRouter();
