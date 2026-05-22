const express = require("express"); // Express Instance
const router = express.Router();
const cleanXSS = require("../utils/xssCleaner") // To prevent XSS Attacks 
const crypto = require("crypto"); // For security & cryptographic operations


// Cross Platform Chatroom Routes

router.post("/create", async function (req, res) {
    try {
        const cleanedBodyData = cleanXSS(req.body);

        // Destructuring Chatroom Creation Request
        const { chatroomName, chatroomDescription, chatroomIcon } = cleanedBodyData;

        // Chatroom name and description validations

        if (!chatroomName || chatroomName.trim() === "") {
            return res.status(400).json({
                status: false,
                message: "Chatroom Name is required"
            });
        }

        if (chatroomName < 6) {
            return res.status(400).json({
                status: false,
                message: "Chatroom Name should be atleast 6 characters"
            });
        }

        if (!chatroomDescription || chatroomDescription.trim() === "") {
            return res.status(400).json({
                status: false,
                message: "Chatroom Description is required"
            });
        }
        if(chatroomDescription.length < 6 ){
             return res.status(400).json({
                status: false,
                message: "Chatroom Description should be atleast 6 characters"
            });
        }

        // Generating random UUID corresponding to each chatroom
        const roomUUID = crypto.randomUUID();

    }
    catch (error) {
        console.error(`[*] Error in creating chatroom ${error.message || error}`)
    }
})



module.exports = router;
