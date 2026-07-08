const express = require("express"); // NodeJs Framework
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router(); // Express Router
const geoIpFilter = require("../middlewares/geoIpFilter"); // GeoIP Filter Middleware

router.get("/reports", geoIpFilter,authMiddleware, async (req,res) => {
    return res.send("Reports not available")
})

module.exports = router;