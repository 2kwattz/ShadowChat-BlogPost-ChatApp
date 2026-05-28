const express = require("express"); // Node Framework
const cluster = require("cluster"); // Horizontal Scaling
const os = require("os"); // CPU/Os Info
const compression = require("compression") // Gzip/Deflate Middleware
const cors = require('cors');
const helmet = require("helmet"); // Basic Security 
const xss = require("xss"); // Cross Site Scripting Prevention
const hpp = require("hpp"); // HTTP Parameter Pollution Protection
const http = require("http"); // Inbuilt Http Server
const { Server } = require("socket.io"); // Socket.io Web Socket Server
const { expressMiddleware } = require('@as-integrations/express5'); // Apollo Express Bridge
const cookieParser = require("cookie-parser"); // To set JWT Token in cookies


// Custom Middlewares
const errorMiddleware = require("../middlewares/errorMiddleware");
const generalRateLimiter = require("../middlewares/generalRateLimiter");
const sqlInjectionGuard = require("../middlewares/sqlInjectionGuard");
const fakeServerHeaders = require("../middlewares/spoofHeaders");

// Utilities
const deviceParser = require("../utils/deviceParser")

// Main / Route is temporarily in Auth Routes
const authRouter = require("../routes/authRouter"); // Auth routes
const chatroomRouter = require("../routes/chatroomRoutes"); // Chatroom Routes

require("dotenv").config(); // DOT ENV Declaration

// MySQL Connection
require("../db/conn");

const PORT = process.env.PORT || 3000;

const app = express(); // Express Server Instance
const server = http.createServer(app); // Web Socket Server Instance
const apolloServer = require("../graphql/server/apolloServer") // Apollo Server Instance for GraphQL

// Allowed Origins

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
];

async function startServer() {
    try {
        await apolloServer.start(); // Initializing Apollo Server
        
        // Middlewares
        app.use(express.json({ limit: "100kb" }));
        app.use(express.urlencoded({ extended: true, limit: "100kb" }));
        app.use(cookieParser()); // Cookie Parser
        app.use(compression()); // GZip/ Deflate compression
        app.use(helmet({contentSecurityPolicy: process.env.NODE_ENV === "development" ? false : true})); // Basic Security
        app.use(cors({ origin: allowedOrigins, credentials: true })); // CORS Implementation (Allowing all domains temporarily)
        app.use(generalRateLimiter); // IP Based Rate Limiting.Max 100 req /15min
        app.use(sqlInjectionGuard); // Additional Layer of SQL Injection Defence Mechanism & IP Logger
        app.use(fakeServerHeaders); // Spoof headers. Confuses Attacker
        app.use(hpp()); // Prevents HTTP Parameter Pollution
        app.use("/graphql", expressMiddleware(apolloServer)) // GraphQl Middleware
        
        // Home & Test Routes

        app.get("/", async (req, res) => {

            const userAgent = req.headers["user-agent"]; // User Device & Browser Details
            const deviceInfo = JSON.stringify(deviceParser(userAgent), null, 2)

            console.log(`[*] Test User Device Info ${deviceInfo}`)
            res.json({
                status: true,
                message: "Home Route Working"
            })
        })

        app.get("/errorTest", (req, res, next) => {
            const simulatedError = new Error("Manual Error Testing");
            simulatedError.statusCode = 500;
            next(simulatedError);
        })

        // Router Middlewares

        app.use("/auth", authRouter); // Authentication routes
        app.use("/room", chatroomRouter); // Chatroom routes
        app.set("trust proxy", false);

        // XSS Sanitization Eg
        // const clean = xss(
        //    '<img src=x onerror=alert(1)>'
        // );

        // To allow a specific param through HPP 
        // app.use(
        //   hpp({
        //     whitelist: ["category"]
        //   })
        // );

        // Web Socket Connection

        const io = new Server(server, {
            cors: {
                origin: "*"
            }
        });


        io.on("connection", function (socket) {

            console.log(`[*] Web Socket Client connected with Socket Id ${socket.id}`);

            // Yet to add listeners
        })

        // 404 Middleware
        app.use((req, res, next) => {
            const error = new Error("Page Not Found");
            error.statusCode = 404;
            next(error);
        });

        // Error Middleware
        app.use(errorMiddleware)

        // app.listen(PORT, () => {
        //     console.log(`[*] Node Server PID ${process.pid} started on port ${PORT}`);
        // });

        server.listen(PORT, () => {
            console.log(`[*] Node Server PID ${process.pid} started on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("[*] Fatal startup error:", error);
        process.exit(1);
    }
}

startServer()