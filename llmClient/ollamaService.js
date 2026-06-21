// Ollama AI Service based on Local Machine

const axios = require("axios"); // HTTP Request Maker
const {BASE_URL} = require("../utils/globals")

// Configuring Qwen2.5 Coder 7B

async function askQwen2(prompt) {
    try {
        
        console.log(`[*] Calling Qwen 2`);
        console.log("[*] Qwen2 Query ",prompt)
        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "qwen2.5-coder:7b",
                prompt,
                stream: false
            });

        return response.data.response;
    }
    catch (error) {
        console.log("[*] Error Running Ollama Qwen2.5-coder:7b model.  ", error)

    }}

// Configuring Qwen3:8B (For Reasoning)

async function askQwen3(prompt) {
    try {

        console.log(`[*] Calling Qwen 3`);
        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "qwen3:8b",
                prompt,
                stream: false
            });
        return response.data.response;
    }
    catch (error) {
        console.log("[*] Error Running Ollama Qwen2.5-coder:7b model.  ", error)
    }
}

// Verifying working of Models

async function verifyModel(modelName) {
    try {
        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: modelName,
                prompt: "Reply with OK",
                stream: false
            }
        );

        if (response.data?.response) {
            console.log(`[*] ${modelName} LLM connected successfully`);
            return true;
        }

        console.log(`[*] ${modelName} LLM returned no response`);
        return false;

    } catch (error) {
        console.log(`[*] ${modelName} LLM connection failed`);
        console.log(`[*] ${error.message}`);
        return false;
    }
}

(async () => {
    await verifyModel("qwen2.5-coder:7b");
    await verifyModel("qwen3:8b");
})();

module.exports = {
    askQwen2,
    askQwen3,
    verifyModel
}