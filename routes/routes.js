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

module.exports = router;