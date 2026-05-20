const express = require("express");
const router = express.Router();

// Validation Function

const validateData = (data) => {

    // Validating First Name
    if (!data.firstName || data.firstName.trim() === "") {
        return {
            status: false,
            error: "First Name is required"
        }};

    // Validating Last Name
    if (!data.lastName || data.lastName.trim() === "") {
        return {
            status: false,
            error: "Last Name is required"
        }};

    // Validating Email Address
    if (!data.email || data.email.trim() === "") {

        return {
            status: false,
            error: "Email is required"
        }};

    // Validating Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {

        return {
            status: false,
            error: "Invalid Email Format"
        }};
    





}

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

    // Fetching User Information

    const {
        firstName,
        lastName,
        email,
        password,
        role,
        gender,
        date_of_birth,

    } = req.body;



})

router.post("/api/login", async function (req, res) {

})
module.exports = router;