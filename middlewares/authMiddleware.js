const jwt = require("jsonwebtoken"); 

const authMiddleware = async (req,res,next) => {
    try{
        console.log("[*] Authenticating User ")
    }
    catch(error){
        console.log(`[*] Error in Auth Middleware ${error.message || error} `);
    }
}

module.exports = authMiddleware;