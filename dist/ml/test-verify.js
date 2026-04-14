import { ExecutionModel, processRawMessages, processMessages } from './ml-basics.js';
import dotenv from 'dotenv';
import path from 'path';
// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// Fallback if .env is in parent
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
const runVerification = async () => {
    console.log("Starting Verification (Exposed APIs)...");
    const families = process.argv.slice(2);
    const modelFamilies = {
        'openai': [
            ExecutionModel.GPT5_4,
            ExecutionModel.GPT5_4_MINI,
            ExecutionModel.GPT5_4_NANO,
        ],
        'anthropic': [
            ExecutionModel.CLAUDE_OPUS_4_6,
            ExecutionModel.CLAUDE_SONNET_4_6,
        ],
        'google': [
            ExecutionModel.GEMINI_3_1_PRO,
            ExecutionModel.GEMINI_3_PRO,
            ExecutionModel.GEMINI_3_FLASH
        ],
        'groq': [
            ExecutionModel.GROQ_GPT_OSS_120B,
        ],
        'fireworks': [
            ExecutionModel.FIREWORKS_DEEPSEEK_V3P1,
            ExecutionModel.FIREWORKS_KIMI_K2P5,
            ExecutionModel.FIREWORKS_GLM_5P1,
            ExecutionModel.FIREWORKS_GPT_OSS_120B,
            ExecutionModel.FIREWORKS_MINIMAX_M2P5,
        ],
        'together': [
            ExecutionModel.TOGETHER_KIMI_K2P5,
            ExecutionModel.TOGETHER_GLM_5P1,
            ExecutionModel.TOGETHER_MINIMAX_M2P5,
            ExecutionModel.TOGETHER_GPT_OSS_120B,
        ],
        'baseten': [
            ExecutionModel.BASETEN_KIMI_K2P5,
            ExecutionModel.BASETEN_GLM_5,
        ]
    };
    let modelsToTest = [];
    if (families.length > 0) {
        for (const family of families) {
            if (modelFamilies[family]) {
                modelsToTest.push(...modelFamilies[family]);
            }
            else {
                console.warn(`Unknown model family: ${family}`);
            }
        }
    }
    else {
        modelsToTest = Object.values(modelFamilies).flat();
    }
    if (modelsToTest.length === 0) {
        console.error("No models to test. Available families:", Object.keys(modelFamilies).join(", "));
        process.exit(1);
    }
    let failed = false;
    const latencies = [];
    for (const model of modelsToTest) {
        const modelLatencies = { model };
        latencies.push(modelLatencies);
        console.log(`\nTesting model: ${model}`);
        // Test: processMessages (JSON Mode)
        try {
            console.log(`  1. processMessages (JSON)...`);
            const messagesJson = [{ role: 'user', content: 'Please return exactly this JSON shape and value: {"status":"json_check"}. Do not omit the status field.' }];
            const start = Date.now();
            const result = await processMessages(messagesJson, "english", model, "json");
            const duration = Date.now() - start;
            modelLatencies.jsonMs = duration;
            if (result && result.status === "json_check") {
                console.log(`     ✅ Success (${duration}ms)`);
            }
            else {
                console.log(`     ⚠️  Success but unexpected output: ${JSON.stringify(result)} (${duration}ms)`);
                failed = true;
            }
        }
        catch (error) {
            console.error(`     ❌ Failed: ${error.message}`);
            if (error.response?.data) {
                console.error(`        Response: ${JSON.stringify(error.response.data)}`);
            }
            failed = true;
        }
        // Test: processRawMessages (Raw Mode)
        try {
            console.log(`  2. processRawMessages (Raw)...`);
            const messagesRaw = [{ role: 'user', content: 'Return the exact marker raw_check and then one short sentence. Do not use JSON.' }];
            const start = Date.now();
            const result = await processRawMessages(messagesRaw, "english", model, "raw");
            const duration = Date.now() - start;
            modelLatencies.rawMs = duration;
            if (result && result.includes("raw_check")) {
                console.log(`     ✅ Success (${duration}ms)`);
            }
            else {
                console.log(`     ⚠️  Success but unexpected output: "${result}" (${duration}ms)`);
                failed = true;
            }
        }
        catch (error) {
            console.error(`     ❌ Failed: ${error.message}`);
            if (error.response?.data) {
                console.error(`        Response: ${JSON.stringify(error.response.data)}`);
            }
            failed = true;
        }
    }
    console.log("\nLatency summary:");
    for (const latency of latencies) {
        const jsonLatency = latency.jsonMs === undefined ? "failed" : `${latency.jsonMs}ms`;
        const rawLatency = latency.rawMs === undefined ? "failed" : `${latency.rawMs}ms`;
        console.log(`  ${latency.model}: json=${jsonLatency}, raw=${rawLatency}`);
    }
    if (failed) {
        console.error("\nSome API tests failed.");
        process.exit(1);
    }
    else {
        console.log("\nAll API tests passed successfully.");
        process.exit(0);
    }
};
runVerification();
