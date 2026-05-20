const express = require("express");
const router = express.Router();

// Routes

router.get("/", async(req,res)=>{
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

router.post("/api/register", async function(req,res){

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

router.post("/api/login", async function(req,res){

})
module.exports = router;