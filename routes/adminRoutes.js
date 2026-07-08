const express = require("express"); // NodeJs Framework
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router(); // Express Router

router.get("/reports", authMiddleware, async (req,res) => {
    return res.send("Reports not available")
})

module.exports = router;