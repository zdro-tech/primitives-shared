import { ExecutionModel, processRawMessages, processMessages, parseFirstCompletion } from './ml-basics.js';
import { logger } from '../logger/logger.js';
import { ChatCompletionMessageParam } from "openai/resources/index";
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
// Fallback if .env is in parent
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });


const runVerification = async () => {
    console.log("Starting Verification (Exposed APIs)...");

    const families = process.argv.slice(2);

    const modelFamilies: Record<string, ExecutionModel[]> = {
        'openrouter': [
            ExecutionModel.OPENROUTER_GPT_OSS_120B,
            ExecutionModel.OPENROUTER_GEMMA_4_31B,
            ExecutionModel.OPENROUTER_KIMI_K2P6,
            ExecutionModel.OPENROUTER_KIMI_K3,
            ExecutionModel.OPENROUTER_GLM_5_2,
            ExecutionModel.OPENROUTER_GLM_5_3,
            ExecutionModel.OPENROUTER_DEEPSEEK_V4P1_FLASH,
        ],
        // A model id that is not registered behaves like a retired one: the first call fails
        // and the answer has to come from the fallback chain.
        'fallback': ["openrouter/retired/model" as ExecutionModel]
    };

    let modelsToTest: ExecutionModel[] = [];
    if (families.length > 0) {
        for (const family of families) {
            if (modelFamilies[family]) {
                modelsToTest.push(...modelFamilies[family]);
            } else {
                console.warn(`Unknown model family: ${family}`);
            }
        }
    } else {
        modelsToTest = Object.values(modelFamilies).flat();
    }

    if (modelsToTest.length === 0) {
        console.error("No models to test. Available families:", Object.keys(modelFamilies).join(", "));
        process.exit(1);
    }

    let failed = false;

    console.log("\nTesting JSON extraction from a reply with prose around it");
    const wrapped = parseFirstCompletion([{ message: { content: 'Widzę, że ma Pan też receptę.\n\n{"q": "Czy prosi Pan o odnowienie obu leków?"}' } }] as any);
    if (wrapped?.q === "Czy prosi Pan o odnowienie obu leków?") {
        console.log("     ✅ Success");
    } else {
        console.log(`     ❌ Unexpected output: ${JSON.stringify(wrapped)}`);
        failed = true;
    }

    const latencies: Array<{ model: ExecutionModel; jsonMs?: number; rawMs?: number }> = [];

    for (const model of modelsToTest) {
        const modelLatencies: { model: ExecutionModel; jsonMs?: number; rawMs?: number } = { model };
        latencies.push(modelLatencies);

        console.log(`\nTesting model: ${model}`);

        // Test: processMessages (JSON Mode)
        try {
            console.log(`  1. processMessages (JSON)...`);
            const messagesJson = [{ role: 'user', content: 'Please return exactly this JSON shape and value: {"status":"json_check"}. Do not omit the status field.' }] as ChatCompletionMessageParam[];
            const start = Date.now();
            const result = await processMessages<{ status: string }>(messagesJson, "english", model, "json");
            const duration = Date.now() - start;
            modelLatencies.jsonMs = duration;

            if (result && result.status === "json_check") {
                console.log(`     ✅ Success (${duration}ms)`);
            } else {
                console.log(`     ⚠️  Success but unexpected output: ${JSON.stringify(result)} (${duration}ms)`);
                failed = true;
            }
        } catch (error: any) {
            console.error(`     ❌ Failed: ${error.message}`);
            if (error.response?.data) {
                console.error(`        Response: ${JSON.stringify(error.response.data)}`);
            }
            failed = true;
        }

        // Test: processRawMessages (Raw Mode)
        try {
            console.log(`  2. processRawMessages (Raw)...`);
            const messagesRaw = [{ role: 'user', content: 'Return the exact marker raw_check and then one short sentence. Do not use JSON.' }] as ChatCompletionMessageParam[];
            const start = Date.now();
            const result = await processRawMessages(messagesRaw, "english", model, "raw");
            const duration = Date.now() - start;
            modelLatencies.rawMs = duration;

            if (result && result.includes("raw_check")) {
                console.log(`     ✅ Success (${duration}ms)`);
            } else {
                console.log(`     ⚠️  Success but unexpected output: "${result}" (${duration}ms)`);
                failed = true;
            }
        } catch (error: any) {
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
    } else {
        console.log("\nAll API tests passed successfully.");
        process.exit(0);
    }
};

runVerification();
