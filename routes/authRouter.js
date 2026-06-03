const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // Bcrypt Hashing
const jwt = require("jsonwebtoken"); // JWT Authentication

const redisClient = require("../redis/redisClient");

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

        console.log("[*] POST /Register route")

        // Fetching User Information & Validation
        const cleanedBodyData = cleanXSS(req.body);

        console.log("[*] Cleaned Req.body for XSS")


        // Request Body Validations

        cleanedBodyData.email = cleanedBodyData?.email?.trim().toLowerCase();
        cleanedBodyData.username = cleanedBodyData?.username?.trim().toLowerCase();
        cleanedBodyData.firstName = formatName(cleanedBodyData?.firstName);
        cleanedBodyData.lastName = formatName(cleanedBodyData?.lastName);


        console.log("[*] Cleaned Trimmed Data")

        const validation = validateData(cleanedBodyData);

        console.log("[*] Validated Data");



        // Validation Failed
        if (!validation.status) {
            console.log("[*] Validation Failed")
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
                role: role,
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

        await res.cookie("token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        try {

            await sendEmail(
                cleanedBodyData.email,
                "Welcome to ShadowChat",
                welcomeTemplate(cleanedBodyData.firstName)
            );
        }
        catch (error) {
            console.log("[*] Error in sending Welcome/Registration Email")
        }

        const deviceUUID = cleanedBodyData.deviceId?.trim();

        // Verifying Device UUID

        if (!deviceUUID) {
            return res.status(400).json({
                status: false,
                message: "Invalid Device UUID"
            })
        }

        // Device UUID Validation Regex
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // Device UUID Regex Test

        if (!deviceUUID || !uuidRegex.test(deviceUUID)) {
            return res.status(400).json({
                status: false,
                message: "Invalid Device UUID"
            });
        }

        // Keeping track of User Device Inventory

        // Fetching User Agent
        const userAgent = req.headers['user-agent'];

        // Parsing User Agent
        const deviceInfoParsed = deviceParser(userAgent);

        console.log("[*] Device Info Parsed /Register route ", deviceInfoParsed);

        const browser = deviceInfoParsed?.browser?.name ?? null;
        const browserVersion = deviceInfoParsed?.browser?.version ?? null;
        const operatingSystem = deviceInfoParsed?.os?.name ?? null;
        const osArchitecture = deviceInfoParsed?.cpu?.architecture ?? null;
        const deviceVendor = deviceInfoParsed?.device?.vendor ?? null;
        const deviceModel = deviceInfoParsed?.device?.model ?? null;
        const osVersion = deviceInfoParsed?.os?.version ?? null;
        const ipAddress = req.ip;
        const isActive = true;
        let deviceType = deviceInfoParsed?.device?.type ?? "Unknown";

        deviceType = deviceInfoParsed?.device?.type
            ? deviceInfoParsed.device.type.charAt(0).toUpperCase() +
            deviceInfoParsed.device.type.slice(1)
            : "Unknown";

        console.log("[*] Browser:", browser);
        console.log("[*] Browser Version:", browserVersion);
        console.log("[*] Operating System:", operatingSystem);
        console.log("[*] OS Architecture:", osArchitecture);
        console.log("[*] IP Address: ", ipAddress);
        console.log("[*] Device Type : ", deviceType);


        console.log(`[*] Device UUID`, deviceUUID);


        const [results] = await pool.execute(`

            INSERT INTO user_devices (
           device_uuid,
            userId,
            user_agent,
            browser,
            browser_version,
            operating_system,
            os_version,
            os_architecture,
            device_type,
            device_vendor,
            device_model,
            ip_address,
            is_active,
            last_seen_at
            )
            VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
            )
                
        ON DUPLICATE KEY UPDATE
        user_agent = VALUES(user_agent),
        browser = VALUES(browser),
        browser_version = VALUES(browser_version),
        operating_system = VALUES(operating_system),
        os_architecture = VALUES(os_architecture),
        device_type = VALUES(device_type),
        ip_address = VALUES(ip_address),
        is_active = VALUES(is_active),
        os_version = VALUES(os_version),
        device_vendor = VALUES(device_vendor),
        device_model = VALUES(device_model),
        last_seen_at = NOW(),
        updated_at = NOW()
        `, [
            deviceUUID,
            result.insertId,
            userAgent,
            browser,
            browserVersion,
            operatingSystem,
            osVersion,
            osArchitecture,
            deviceType,
            deviceVendor,
            deviceModel,
            ipAddress,
            isActive
        ]);

        await res.status(201).json({
            status: true,
            message: "Registration Successful. Please check email for verification code",
            token: token
        });




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
        const password = cleanedBodyData.password?.trim();
        const deviceUUID = cleanedBodyData.deviceId?.trim();
        const userIpAddress = req.ip;

        console.log(`[*] Identifier `, identifier);
        console.log(`[*] Device UUID`, deviceUUID);

        // Verifying Device UUID

        if (!deviceUUID) {
            return res.status(400).json({
                status: false,
                message: "Invalid Device UUID"
            })
        }

        // Device UUID Validation Regex
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        // Device UUID Regex Test

        if (!deviceUUID || !uuidRegex.test(deviceUUID)) {
            return res.status(400).json({
                status: false,
                message: "Invalid Device UUID"
            });
        }

        // Identifier Validation
        if (!identifier) {

            console.log("[*] Identifier missing")

            return res.status(400).json({
                status: false,
                message: "Email or Username is required"
            })
        };

        // Password Validation

        if (!password) {
            console.log("[*] Password Missing");

            return res.status(400).json({
                status: false,
                message: "Password is required"
            })
        }

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

        // Storing User Information
        const user = users[0];
        const userId = user.userId;

        // Validation if user does not exist
        if (users.length === 0) {

            // Fake hash to prevent timing based enumeration attack
            await bcrypt.compare(password, fakeHash);

            // Storing UserId + Ip Address Unique key in redis for IP + Email based bruteforce prevention
            const key = `login:${userId}:${ipAddress}`;

            // Fetching login attempts from Redis Cache
            const loginAttempts = await redisClient.get(key);


            return res.status(401).json({
                status: false,
                message: "Invalid Credentials"

            })
        }



        console.log("[*] User Id /Login Route ", userId)

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

        // Fetching User Agent from headers
        const userAgent = req.headers['user-agent'];

        // Parsing User Agent

        const deviceInfoParsed = deviceParser(userAgent);

        const browser = deviceInfoParsed?.browser?.name ?? null;
        const browserVersion = deviceInfoParsed?.browser?.version ?? null;
        const operatingSystem = deviceInfoParsed?.os?.name ?? null;
        const osArchitecture = deviceInfoParsed?.cpu?.architecture ?? null;
        const deviceVendor = deviceInfoParsed?.device?.vendor ?? null;
        const deviceModel = deviceInfoParsed?.device?.model ?? null;
        const osVersion = deviceInfoParsed?.os?.version ?? null;
        const ipAddress = req.ip;
        const isActive = true;
        let deviceType = deviceInfoParsed?.device?.type ?? "Unknown";

        deviceType =
            deviceInfoParsed?.device?.type
                ? deviceInfoParsed.device.type.charAt(0).toUpperCase() +
                deviceInfoParsed.device.type.slice(1)
                : "Unknown";

        console.log("[*] Browser:", browser);
        console.log("[*] Browser Version:", browserVersion);
        console.log("[*] Operating System:", operatingSystem);
        console.log("[*] OS Architecture:", osArchitecture);
        console.log("[*] IP Address: ", ipAddress);
        console.log("[*] Device Type : ", deviceType)



        const [results] = await pool.execute(`

            INSERT INTO user_devices (
           device_uuid,
            userId,
            user_agent,
            browser,
            browser_version,
            operating_system,
            os_version,
            os_architecture,
            device_type,
            device_vendor,
            device_model,
            ip_address,
            is_active,
            last_seen_at
            )
            VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
            )
                
        ON DUPLICATE KEY UPDATE
        user_agent = VALUES(user_agent),
        browser = VALUES(browser),
        browser_version = VALUES(browser_version),
        operating_system = VALUES(operating_system),
        os_architecture = VALUES(os_architecture),
        device_type = VALUES(device_type),
        ip_address = VALUES(ip_address),
        is_active = VALUES(is_active),
        os_version = VALUES(os_version),
        device_vendor = VALUES(device_vendor),
        device_model = VALUES(device_model),
        last_seen_at = NOW(),
        updated_at = NOW()
        `, [
            deviceUUID,
            user.userId,
            userAgent,
            browser,
            browserVersion,
            operatingSystem,
            osVersion,
            osArchitecture,
            deviceType,
            deviceVendor,
            deviceModel,
            ipAddress,
            isActive
        ]);


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
        console.log(`[*] Error. Cannot Decode User ${error.message || error}`);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })


    }
})

// User Profile

router.get("/myprofile", authMiddleware, async function (req, res) {
    try {
        console.log("[*] GET /MyProfile");


        // Fetching User Id from Request Header
        const userId = req.user.id;

        // Fetching User from Redis Cache if its available
        const cachedUser = await redisClient.get(`user:${userId}`);

        if (!cachedUser) {

            console.log("[*] User Profile Information not available in cache. Quering Database");

            // Fetching User's data from database
            const [users] = await pool.execute(`SELECT userId,firstName,lastName,email,username,gender,latitude,longitude,bio,profile_picture,created_at,gender,latitude,longitude,is_verified,date_of_birth,password FROM users WHERE userId = ? LIMIT 1`, [userId]);


            // If user doesnt exist
            if (users.length === 0) {

                console.log(`[*] GET /MyProfile : User not found`);

                return res.json({
                    status: false,
                    message: "User not found"
                })
            }

            // Storing User Info
            const user = users[0];

            console.log("[*] Console Logging User Info ", user);

            // Storing Data in Redis Cache
            await redisClient.set(`user:${userId}`, JSON.stringify(user),
                "EX",
                86400
            );
            console.log("[*] User Profile in Redis stored successfully");

            return res.status(200).json({
                status: true,
                message: "User Details fetched successfully",
                data: user,
            })
        }
        else {

            console.log(`[*] Redis Cache HIT`);
            return res.status(200).json({
                status: true,
                message: "User Details fetched sucessfully",
                data: JSON.parse(cachedUser)

            })
        }
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error"
        })

    }
})

// Fetch User Devices
router.get("/mydevices", authMiddleware, async function (req, res) {
    try {
        console.log(`[*] GET /MyDevices`);

        // Fetching User Id
        console.log("[*] My Devices REQ.USER DATA ", req.user)
        const userId = req.user.id

        console.log("[*] User Id fetched ", userId)

        if (!userId) {
            return res.status(401).json({
                status: false,
                message: "Invalid User",
            })
        }

        console.log("[*] Fetched User Id ", userId);

        const [devices] = await pool.execute("SELECT * FROM user_devices WHERE userId =?", [userId]);

        console.log("[*] User Devices Info fetched ", devices);

        if (devices.length === 0) {

            // If No devices are stored in database
            return res.status(200).json({
                status: true,
                message: "User does not have any registered devices",
                devices: []
            })
        }

        return res.status(200).json({
            status: true,
            message: "User devices fetched successfully",
            devices: devices
        })
    }
    catch (error) {

        console.log(`[*] Error in fetching User Devices ${error.message || error} `)

        return res.status(500).json({
            status: false,
            message: "Error fetching user devices"
        })


    }
})


module.exports = router;
