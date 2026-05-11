const express = require("express"); // Node Framework
const bodyParser = require("body-parser"); // Req.Body Parser
const cluster = require("cluster"); // Horizontal Scaling
const os = require("os"); // CPU/Os Info
const compression = require("compression") // Gzip/Deflate Middleware
const cors = require('cors'); // 



const PORT = process.env.PORT || 3000;

const app = express();

    // Middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(compression()); // GZip/ Deflate compression

    app.use(cors({origin: "*",credentials: true})); // CORS Implementation (Allowing all domains temporarily)
    

    // Dummy route
    app.get("/", (req, res) => {
        res.send(`Handled by worker ${process.pid}`);
    });

    app.listen(PORT, () => {
        console.log(`[*] Node Server PID ${process.pid} started on port ${PORT}`);
    });