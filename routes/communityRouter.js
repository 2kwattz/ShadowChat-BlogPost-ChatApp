const express = require("express");
const router = express.Router();

// Auth Middleware

const authMiddleware = require("../middlewares/authMiddleware");

// For multipart form data (images etc)
const multer = require("multer");

// Multer Configuration

const upload = multer({
    dest: "uploads/communities/"
})

const redisClient = require("../redis/redisClient");

// Utility Functions
const sendEmail = require("../services/sendEmail"); // Email Service
const deviceParser = require("../utils/deviceParser"); // Device User Agent Parsing
const cleanXSS = require("../utils/xssCleaner"); // To prevent XSS Attacks 
const { formatName } = require("../utils/commonHelpers"); // Common Helper Functions

// SQL Connection
const { pool } = require("../db/conn");

// Community Routes

router.post("/create", authMiddleware, upload.single("cIcon"), async function (req, res) {
    try {
        console.log("[*] Inside Create Community Route");

        const cleanedBodyData = cleanXSS(req.body);

        // Formatting Community Name
        cleanedBodyData.cName = formatName(cleanedBodyData?.cName).trim() || "";
        cleanedBodyData.cDescription = cleanedBodyData.cDescription?.trim() || "";
        cleanedBodyData.cIcon = req.file?.path || null;
        cleanedBodyData.cSlug = cleanedBodyData.cSlug?.trim() || "";

        // Normalized Community Name
        const normalizedCommunitySlug = cleanedBodyData.cSlug.trim().toLowerCase();

        // Validations

        // Validating Slug/ Subcommunity
        if (!cleanedBodyData.cSlug) {
            return res.status(400).json({
                status: false,
                message: "Community slug is required"
            });
        }

        // Validating Name
        if (!cleanedBodyData.cName) {
            return res.status(400).json({
                status: false,
                message: "Community name is required"
            });
        }

        // Validating Description
        if (!cleanedBodyData.cDescription) {
            return res.status(400).json({
                status: false,
                message: "Community description is required"
            });
        }

        // Validating Rules
        if (!cleanedBodyData.cRules) {
            return res.status(400).json({
                status: false,
                message: "Community rules are required"
            });
        }

    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }
})








module.exports = router;