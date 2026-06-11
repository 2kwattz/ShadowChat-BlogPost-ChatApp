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
        cleanedBodyData.cRules = cleanedBodyData.cRules?.trim() || "";

        // User Id from Request Header
        const userId = req.user.id;

        // Regex to validate slug
        const slugTestRegex = /^[A-Za-z][A-Za-z0-9_]*$/;

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

        if(!slugTestRegex.test(cleanedBodyData.cSlug)){
              return res.status(400).json({
                status: false,
                message: "Community slug can only contain numbers, underscores and alphabets. Slug cannot start with number or underscore"
            });
        }

        // Validating Slug's uniqueness

        const [existingCommunitySlug] = await pool.query("SELECT community_id FROM communities WHERE community_slug =  ?",[cleanedBodyData.cSlug]);

        if(existingCommunitySlug.length > 0){
            return res.status(400).json({
                status: false,
                message: "Community slug already exists. Please use a different slug"
            })
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
        };

        // Registering Community

        

    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }
})








module.exports = router;