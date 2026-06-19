const express = require("express"); // NodeJs Framework
const router = express.Router(); // Express Router

const redisClient = require("../redis/redisClient"); // Caching
const authMiddleware = require("../middlewares/authMiddleware");

const {askQwen2} = require("../llmClient/ollamaService");
const cleanXSS = require("../utils/xssCleaner");

// Routes

router.post("/askllm", authMiddleware,async function(req,res){

    try{
        console.log("[*] Request Sent to QWEN2.5 7B Model");
        const query = req.body.query;

        if(!query){
            return res.status(400).json({
                status: false,
                message: "Invalid Query"
            })
        }

        const response = await askQwen2(query)

        if(response){
            return res.status(200).json({
                status:true,
                message:response
            })
        }
        
        else{
            return res.status(500).json({
                status:false,
                message:"Internal Server Error"
            })
        }
    }
    catch(error){
         console.log("[*] Error sending request to QWEN2.5 7B Model", error);
    }
})

module.exports = router;