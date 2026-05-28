const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // Bcrypt Hashing
const jwt = require("jsonwebtoken"); // JWT Authentication

// Templates
const welcomeTemplate = require("../templates/welcome")


// Utility Functions
const sendEmail = require("../services/sendEmail"); // Email Service
const deviceParser = require("../utils/deviceParser"); // Device User Agent Parsing
const cleanXSS = require("../utils/xssCleaner"); // To prevent XSS Attacks 
const { formatName } = require("../utils/commonHelpers"); // Common Helper Functions

const { pool } = require("../db/conn");
const authMiddleware = require("../middlewares/authMiddleware");

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
const usernameRegex = /^[a-zA-Z0-9_]+$/;

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

    if (data.username.length < 3 || data.username.length > 16) {
        return {
            status: false,
            error: "Username must be between 3 and 16 characters"
        };
    }
    if (!usernameRegex.test(data.username)) {
        return {
            status: false,
            error: "Username can only contain characters, numbers and underscores"
        }
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

router.post("/register", async function (req, res) {

    try {

        console.log("[*] GET /Register route")

        // Fetching User Information & Validation
        const cleanedBodyData = cleanXSS(req.body);

         console.log("[*] Cleaned Req.body for XSS")


        // Request Body Validations

        cleanedBodyData.email = cleanedBodyData.email?.trim().toLowerCase();
        cleanedBodyData.username = cleanedBodyData.username?.trim().toLowerCase();
        cleanedBodyData.firstName = formatName(cleanedBodyData.firstName);
        cleanedBodyData.lastName = formatName(cleanedBodyData.lastName);

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
            VALUES (?,?,?,?,?,?,?,?)`, [
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
                 firstName: cleanedBodyData.firstName,
            lastName: cleanedBodyData.lastName,
            email: cleanedBodyData.email,
            gender: cleanedBodyData.gender,
            bio: cleanedBodyData.bio,
            role: cleanedBodyData.role 
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d"
            }
        );

        // Upon Token Generation failure
        if (!token) {
            return res.status(500).json({
                status: false,
                message: "Token generation failed"
            });
        }

        res.cookie("token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


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

router.post("/login", async function (req, res) {
    try {
        console.log("[*] GET POST /Login Route ")
        const cleanedBodyData = cleanXSS(req.body); // Sanitizes values against XSS attacks for eg < will become &lt


        // Fetching username/email & password

        console.log("Clean Body Data ", cleanedBodyData)
        const identifier = cleanedBodyData.identifier?.trim().toLowerCase();
        const password = cleanedBodyData.password;

        console.log(`[*] Identifier `, identifier);
        console.log(`[*] Password `, password);


        if (!identifier) {

            console.log("[*] Identifier missing")

            return res.status(400).json({
                status: false,
                message: "Email or Username is required"
            })
        };

        const isEmail = emailRegex.test(identifier);

        if (isEmail) {

            // Validating Email Format

            const email = identifier;
            const emailDomain = email.split("@")[1];

            // Validating Domain Authenticity
            if (blockedDomains.includes(emailDomain)) {
                return res.status(400).json({
                    status: false,
                    error: "Temporary Email Addresses are not allowed"
                })
            }

        }

        else {
            // User entered username
            if (identifier.length < 3 || identifier.length > 16) {
                return res.status(400).json({
                    status: false,
                    error: "Username must be between 3 and 16 characters"
                });
            }
            else if (!usernameRegex.test(identifier)) {
                return res.status(400).json({
                    status: false,
                    error: "Username can only contain characters, numbers and underscores"
                })
            }

        }

        // Verifying User from Database

        // Fake Hash to prevent enumeration attack via response timing
        const fakeHash = "$2b$10$KbQiM6TA6L/2esL8hWT8EOV9V7sXxJ0L0K9lK1w2r0kM7rj8yP6yS";
        let users;

        // const [users] = await pool.execute(
        //     `
        //     SELECT userId, email, password, username FROM users
        //     WHERE email = ? OR username = ?
        //     LIMIT 1
        //     `,
        //     [identifier, identifier]
        // );


        if (isEmail) {

            [users] = await pool.execute(`
        SELECT *
        FROM users
        WHERE email = ?
        LIMIT 1
        `, [identifier]);

        } else {

            [users] = await pool.execute(
                `
        SELECT *
        FROM users
        WHERE username = ?
        LIMIT 1
        `,
                [identifier]
            );
        }

        // Validation if user does not exist
        if (users.length === 0) {

            // Fake hash to prevent timing based enumeration attack
            await bcrypt.compare(password, fakeHash);

            return res.status(401).json({
                status: false,
                message: "Invalid Credentials"

            })
        }

        const user = users[0];

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        )

        // Validation if password is incorrect
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: false,
                message: "Invalid Credentials"
            })
        }

        // Generating JWT Token
        const token = jwt.sign({
            id: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender,
            bio: user.bio,
            role: user.role 
        },
            process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        }
        );

        console.log(`[*] User ${user.username} logged in successfully`);

        // Setting JWT token in cookie
        res.cookie("token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        return res.status(200).json({
            status: true,
            message: "Login Successful",
            token: token
        })
    }
    catch (error) {
        console.log(`[*] Error in handling POST /api/login route ${error.message || error}`)
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })
    }

})

// Auth Verification

router.get("/me", authMiddleware, function (req, res) {
    try {
        return res.json({
            success: true,
            user: req.user
        })
    }
    catch (error) {
        console.log(`[*] Error. Cannot Decode User ${error.message || error}`)

    }
})
module.exports = router;
