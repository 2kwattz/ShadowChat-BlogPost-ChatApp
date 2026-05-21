const express = require("express");
const router = express.Router();
const xss = require("xss"); // To prevent XSS Attacks 
const bcrypt = require("bcrypt"); // Bcrypt Hashing
const jwt = require("jsonwebtoken"); // JWT Authentication

// Templates
const welcomeTemplate = require("../templates/welcome")

const sendEmail = require("../services/sendEmail"); // Email Service
const deviceParser = require("../utils/deviceParser");

const { pool } = require("../db/conn")


// XSS Cleaned Value Helper Function
const cleanXSS = (obj) => {

    const cleaned = {};

    const excludedFields = [
        "password",
        "confirmPassword"
    ];

    for (let key in obj) {
        if (
            typeof obj[key] === "string" &&
            !excludedFields.includes(key)
        ) {

            cleaned[key] = xss(obj[key].trim());
        } else {

            cleaned[key] = obj[key];

        }
    }
    return cleaned;
};

// Disposable / Temp Mail Domains
const blockedDomains = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "yopmail.com",
    "trashmail.com",
    "fakeinbox.com"
];

const allowedGenders = ["male", "female", "other"];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation Function

const validateData = (data) => {


    // Validating First Name
    if (!data.firstName || data.firstName.trim() === "") {
        return {
            status: false,
            error: "First Name is required"
        }
    };

    // Validating Last Name
    if (!data.lastName || data.lastName.trim() === "") {
        return {
            status: false,
            error: "Last Name is required"
        }
    };

    // Validating Username
    if (!data.username || data.username.trim() === "") {
        return {
            status: false,
            error: "Username is required"
        }
    }

    if (emailRegex.test(data.username)) {
        return {
            status: false,
            error: "Username cannot be an email address"
        };
    }

    // Validating Email Address
    if (!data.email || data.email.trim() === "") {

        return {
            status: false,
            error: "Email is required"
        }
    };

    // Validating Email Format

    const email = data.email.trim().toLowerCase();

    if (!emailRegex.test(email)) {

        return {
            status: false,
            error: "Invalid Email Format"
        }
    };

    const emailDomain = email.split("@")[1];

    // Validating Domain Authenticity
    if (blockedDomains.includes(emailDomain)) {
        return {
            status: false,
            error: "Temporary Email Addresses are not allowed"
        }
    }

    // Validating Password
    if (!data.password) {
        return {
            status: false,
            error: "Password is required"
        }
    }

    // Validating confirm password
    if (!data.confirmPassword) {
        return {
            status: false,
            error: "Confirm Password is required"
        }
    }

    // Validating Password's length
    if (data.password.length < 6) {
        return {
            status: false,
            error: "Password should atleast be 6 characters"
        }
    }

    // Verifying Password and Confirm Password
    if (data.password !== data.confirmPassword) {
        return {
            status: false,
            error: "Password and Confirm Password do not match"
        }
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    // Validating Strong Password
    if (!passwordRegex.test(data.password)) {
        return {
            status: false,
            error:
                "Password must contain uppercase, lowercase and number"
        }
    };

    // Validating Date Of Birth
    if (!data.date_of_birth) {
        return {
            status: false,
            error: "Date Of Birth is required"
        }
    }

    // Creating Date Object
    const dob = new Date(`${data.date_of_birth}T00:00:00`);

    // Checking Invalid Date
    if (isNaN(dob.getTime())) {
        return {
            status: false,
            error: "Invalid Date Of Birth"
        }
    }

    // Checking Future Date
    const currentDate = new Date();

    if (dob > currentDate) {
        return {
            status: false,
            error: "Date Of Birth cannot be in the future"
        }
    }

    // Calculating Age
    let age = currentDate.getFullYear() - dob.getFullYear();

    const monthDifference =
        currentDate.getMonth() - dob.getMonth();

    // Adjusting Age Properly
    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            currentDate.getDate() < dob.getDate()
        )) {
        age--;
    }

    // Minimum Age Validation
    if (age < 13) {
        return {
            status: false,
            error: "Minimum age should be 13 years"
        }
    };

    // Maximum Age Validation
    if (age > 120) {
        return {
            status: false,
            error: "Invalid Date Of Birth"
        }
    };

    if (!allowedGenders.includes(data.gender)) {
        return {
            status: false,
            error: "Invalid Gender"
        };
    }

    return {
        status: true
    }
};

// Routes

router.get("/", async (req, res) => {

    const userAgent = req.headers["user-agent"]; // User Device & Browser Details
    const deviceInfo = JSON.stringify(deviceParser(userAgent), null, 2)

    console.log(`[*] Test User Device Info ${deviceInfo}`)
    res.json({
        status: true,
        message: "Home Route Working"
    })
})

router.get("/errorTest", (req, res, next) => {
    const simulatedError = new Error("Manual Error Testing");
    simulatedError.statusCode = 500;
    next(simulatedError);
})

// Cross Platform Routes

router.post("/api/register", async function (req, res) {

    try {

        // Fetching User Information & Validation

        const cleanedBodyData = cleanXSS(req.body);

        // Request Body Validations

        cleanedBodyData.email = cleanedBodyData.email?.trim().toLowerCase();
        const validation = validateData(cleanedBodyData);

        // Validation Failed
        if (!validation.status) {
            return res.status(400).json(validation);
        }

        console.log("[*] Checking existing users...");

        // Verifying Username & Email Address
        const [existingUsers] = await pool.execute(`
            SELECT userId FROM users WHERE username = ? OR email = ? LIMIT 1`, [cleanedBodyData.username, cleanedBodyData.email]);

        if (existingUsers.length > 0) {

            console.log(`[*] User Already Exists`)
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Enforcing user's role as "User" since frontend cannot be trusted
        const role = "user";

        // Hashing password using bcrypt

        const hashedPassword = await bcrypt.hash(cleanedBodyData.password, 10);

        // Registering User 
        const [result] = await pool.execute(`
            INSERT INTO users (
            firstName,
            lastName,
            username,
            email,
            password,
            gender,
            date_of_birth,
            role)
            VALUES (?,?,?,?,?,?,?,?)`,[
            cleanedBodyData.firstName,
            cleanedBodyData.lastName,
            cleanedBodyData.username,
            cleanedBodyData.email,
            hashedPassword,
            cleanedBodyData.gender,
            cleanedBodyData.date_of_birth,
            role
        ]);

        // Generating JWT Token

        const token = jwt.sign(
            {
                id: result.insertId,
                role: role,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            status: true,
            message: "Registration Successful",
            token: token
        });

        await sendEmail(
            cleanedBodyData.email,
            "Welcome to ShadowChat",
            welcomeTemplate(cleanedBodyData.firstName)
        );

    }

    catch (error) {
        console.error(`[*] Error in registering user ${error.message || error}`);

        // Manual Response
        return res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }


})

router.post("/api/login", async function (req, res) {
    try {

        const cleanedBodyData = cleanXSS(req.body); // Sanitizes values against XSS attacks for eg < will become &lt
        const { identifier, password } = cleanedBodyData; // Fetching username/email & password

        if (!identifier || !password) {
            return res.status(400).json({
                status: false,
                message: "Enter username/email and password"
            })
        }
        // Validating identifier for username/email

        const isEmail = emailRegex.test(identifier);

        // JSON Response only for testing purpose
        // if (isEmail) {
        //     return res.json({
        //         status: true,
        //         message: "Identifier is an email address"
        //     })
        // }
        // else {
        //     return res.json({
        //         status: true,
        //         message: "Identifier is a username"
        //     })
        // }


    }
    catch (error) {
        console.log(`[*] Error in handling POST /api/login route ${error.message || error}`)
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }

})
module.exports = router;
