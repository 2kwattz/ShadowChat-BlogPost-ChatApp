const express = require("express");
const router = express.Router();
const xss = require("xss"); // To prevent XSS Attacks 
const bcrypt = require("bcrypt"); // Bcrypt Hashing

// Templates
const welcomeTemplate = require("../templates/welcome")

const sendEmail = require("../services/sendEmail")

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

        }}
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

    // Validating Email Address
    if (!data.email || data.email.trim() === "") {

        return {
            status: false,
            error: "Email is required"
        }
    };

    // Validating Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
            error: "Password cannot be empty"
        }
    }

    if (!data.confirmPassword) {
    return {
        status: false,
        error: "Confirm Password cannot be empty"
    }
}

    if (data.password.length < 6) {
        return {
            status: false,
            error: "Password should atleast be 6 characters"
        }
    }

    if (data.password !== data.confirmPassword) {
        return {
            status: false,
            error: "Password and Confirm Password do not match"
        }
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(data.password)) {
        return {
            status: false,
            error:
                "Password must contain uppercase, lowercase and number"
        }};

    // Validating Date Of Birth
    if (!data.date_of_birth) {
        return {
            status: false,
            error: "Date Of Birth cannot be empty"
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

    try{

    // Fetching User Information & Validation

    const cleanedBodyData = cleanXSS(req.body);

    const validation = validateData(cleanedBodyData);

    // Validation Failed
    if (!validation.status) {
        return res.status(400).json(validation);
    }

    // Enforcing user's role as "User" since frontend cannot be trusted
    const role = "user";

    await sendEmail(
        cleanedBodyData.email,
        "Welcome to ShadowChat",
        welcomeTemplate(cleanedBodyData.firstName)
    );

    res.json({
        status: true,
        message: "Registration Successful"
    });


    }

    catch(error){
        console.error(`[*] Error in registering user ${error.message || error}`);
        
        // Manual Response
         return res.status(500).json({
            status: false,
            error: "Internal Server Error"
        });
    }


})

router.post("/api/login", async function (req, res) {

})
module.exports = router;
