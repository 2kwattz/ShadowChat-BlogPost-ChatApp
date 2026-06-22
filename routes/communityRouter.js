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

    const connection = await pool.getConnection(); // Required for SQL Transaction

    try {
        console.log("[*] Inside Create Community Route");


        // Cleaned Body Request
        const cleanedBodyData = cleanXSS(req.body);

        // Formatting Community Name
        cleanedBodyData.cName = formatName(cleanedBodyData?.cName).trim() || "";
        cleanedBodyData.cDescription = cleanedBodyData.cDescription?.trim() || "";
        cleanedBodyData.cIcon = req.file?.path || null;
        cleanedBodyData.cSlug = cleanedBodyData.cSlug?.trim() || "";
        cleanedBodyData.cRules = cleanedBodyData.cRules?.trim() || "";

        console.log("[*] Community Slug Value ", cleanedBodyData.cSlug);
        console.log("[*] Community Name Value ", cleanedBodyData.cName);

        // User Id from Request Header
        const userId = req.user.id;


        // Member Count : 1 => Because an admin is the first member

        const member_count = 1;

        // Validations

        // Validating Slug/ Subcommunity
        if (!cleanedBodyData.cSlug) {
            return res.status(400).json({
                status: false,
                message: "Community slug is required"
            });
        }

        // Regex to validate slug
        const slugTestRegex = /^[A-Za-z][A-Za-z0-9_]*$/;

        // Normalized Community Name
        const normalizedCommunitySlug = cleanedBodyData.cSlug.trim().toLowerCase();

        if (!slugTestRegex.test(cleanedBodyData.cSlug)) {
            return res.status(400).json({
                status: false,
                message: "Community slug can only contain numbers, underscores and alphabets. Slug cannot start with number or underscore"
            });
        }

        // Validating Slug's uniqueness

        const [existingCommunitySlug] = await connection.query("SELECT community_id FROM communities WHERE normalized_slug =  ?", [normalizedCommunitySlug]);

        if (existingCommunitySlug.length > 0) {
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

        await connection.beginTransaction(); // Starting Transaction

        const [insertCommunity] = await connection.query(
            `
        INSERT INTO communities
        (
        community_name,
        community_icon_url,
        community_rules,
        community_slug,
        normalized_slug,
        community_admin_id,
        community_description,
        member_count
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
            [
                cleanedBodyData.cName,
                cleanedBodyData.cIcon,
                cleanedBodyData.cRules,
                cleanedBodyData.cSlug,
                normalizedCommunitySlug,
                userId,
                cleanedBodyData.cDescription,
                member_count
            ]
        );

        if (insertCommunity.affectedRows !== 1) {
            throw new Error("Community insert failed");
        }
        const communityId = insertCommunity.insertId;
        const role = "admin"; // Since only admin can create a group

        // Inserting User Id and Community Id in Junction Table

        const [community_user_membership] = await connection.query(`INSERT INTO community_members (user_id,community_id,role)
            VALUES(?,?,?)`, [
            userId,
            communityId,
            role
        ])

        if (community_user_membership.affectedRows !== 1) {
            throw new Error("Membership insert failed");
        }

        await connection.commit(); // SQL Transaction Completed

        return res.status(201).json({
            status: true,
            message: "Community created successfully",
            communityId,
            communitySlug: cleanedBodyData.cSlug
        });

    }
    catch (error) {

        await connection.rollback();

        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }

    finally {
        connection.release();
    }
})

// List All Communities

router.get("/all", async function (req, res) {

    try {
        console.log("[*] Listing all communities");

        // Quering Page

        const page = parseInt(req.query.page) || 1;

        // Capping the limit to 50 
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 20, 1),
            50
        );
        const offset = (page - 1) * limit;

        // Fetching Communities

        const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM communities`);

        const totalCommunities = countRows[0].total;

        console.log("[*] Total Communities Count ", totalCommunities);

        // Fetching communitites from database

        const [communities] = await pool.query(`SELECT * FROM communities ORDER BY community_id DESC LIMIT ? OFFSET ?`, [limit, offset]);

        // Calculating Total Pages

        const totalPages = Math.ceil(totalCommunities / limit);

        res.status(200).json({
            status: true,
            page,
            limit,
            totalCommunities,
            totalPages,
            data: communities
        })

    }
    catch (error) {

        res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })

    }

})

// View Specific Community

router.get("/:communitySlug", authMiddleware, async function name() {

    try {
        console.log("[*] Fetching Community Details");

        // Regex to validate slug
        const slugTestRegex = /^[A-Za-z][A-Za-z0-9_]*$/;


        const communitySlug = cleanXSS(req.body.communitySlug).trim().toLowerCase();
        if (!slugTestRegex.test(communitySlug)) {
            return res.status(400).json({
                status: false,
                message: "Community slug can only contain letters, numbers and underscores. First character can only be a letter"
            })
        }

        const fetchCommunityQuery = `SELECT * FROM communities WHERE normalized_slug = ? LIMIT 1`;

        const [result] = await pool.execute(fetchCommunityQuery, communitySlug);

        if (!result) {
            return res.status(404).json({
                status: false,
                message: "Community not found"
            })
        }

        if (result.length > 50) {

            return res.status(409).json({
                status: false,
                message: "Community name cannot be more than 50 characters"
            })

        }

        const community = result[0];

        return res.status(200).json({
            status: true,
            communityName: community.community_name,
            communityDescription: community.community_description,
            communityRules: community.community_rules,
            communityCoverImage: community.community_cover_url,
            communityIcon: community.community_icon_url,
            communityAdmin: community.community_admin_id,
            communitySlug: community.community_slug,
            memberCount: community.member_count,
        })
    }
    catch (error) {
        console.log("[*] Error in fetching community name ", error);

        console.log(`[*] Error in loading room ${error.message || error}`);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        });
    }

});

module.exports = router;