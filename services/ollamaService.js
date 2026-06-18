// Ollama AI Service based on Local Machine

const axios = require("axios");

async function askOllamaAI(prompt) {

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
        console.log("[*] Error Running Ollama qwen2.5-coder:7b model.  ", error)
    }

}