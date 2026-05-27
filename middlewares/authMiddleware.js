const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        console.log("[*] Authenticating User ")
        // const authHeader = req.headers.authorization; // Fetching JWT Bearer Token

        // If Authorization Header is missing
        // if (!authHeader) {

        //     console.error("[*] Auth Header Missing")
        //     return res.status(401).json({
        //         status: false,
        //         message:"Authorization header missing"
        //     });
        // }

        // If Authorization Header has invalid format
        // if (!authHeader.startsWith("Bearer ")) {

        //     return res.status(401).json({
        //         status: false,
        //         message:"Invalid Authorization Format"
        //     })};

        // Fetching JWT Token
        // const token = authHeader.split(" ")[1];

          // Fetch token from cookies
        const token = req.cookies.token;

        // If JWT Token is missing
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Token missing"
            });

        }

        // Verifying JWT Token Signature
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        // Appending user details in Request object
        req.user = decoded;

        console.log("[*] User Authenticated")
        next();


    }
    catch (error) {
        console.log(`[*] Error in Auth Middleware ${error.message || error} `);
        return res.status(401).json({
            status: false,
            message:"Invalid or Expired Token"
        })
    }
}

module.exports = authMiddleware;