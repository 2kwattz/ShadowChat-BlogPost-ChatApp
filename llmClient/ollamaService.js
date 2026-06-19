// Ollama AI Service based on Local Machine

const axios = require("axios");

// Configuring Qwen2.5 Coder 7B

async function askQwen2(prompt) {

    try {
        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "qwen2.5-coder:7b",
                prompt,
                stream: false
            }
        );

        return response.data.response;

    }
    catch (error) {
        console.log("[*] Error Running Ollama Qwen2.5-coder:7b model.  ", error)
    }
}

// Configuring Qwen3:8B (For Reasoning)

async function askQwen3(prompt) {

    try {
        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "qwen3:8b",
                prompt,
                stream: false
            }
        );

        return response.data.response;

    }
    catch (error) {
        console.log("[*] Error Running Ollama Qwen2.5-coder:7b model.  ", error)
    }
}
