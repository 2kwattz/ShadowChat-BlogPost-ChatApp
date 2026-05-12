const express = require("express"); // Node Framework
const bodyParser = require("body-parser"); // Req.Body Parser
const cluster = require("cluster"); // Horizontal Scaling
const os = require("os"); // CPU/Os Info
const compression = require("compression") // Gzip/Deflate Middleware
const cors = require('cors');
const helmet = require("helmet"); // Basic Security 
const errorMiddleware = require("../middlewares/errorMiddleware")
require("dotenv").config(); // DOT ENV Declaration




const PORT = process.env.PORT || 3000;

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression()); // GZip/ Deflate compression
app.use(helmet());
app.use(cors({ origin: "*", credentials: true })); // CORS Implementation (Allowing all domains temporarily)


// Dummy route
app.get("/", (req, res) => {
    res.send(`Handled by worker ${process.pid}`);
});

app.get("/errorTest", (req, res, next) => {
    const simulatedError = new Error("Manual Error Testing");
    simulatedError.statusCode = 400;
    next(simulatedError);
})

// 404 Middleware

app.use((req, res, next) => {

    const error = new Error("Page Not Found");

    error.statusCode = 404;

    next(error);

});

// Error Middleware
app.use(errorMiddleware)



app.listen(PORT, () => {
    console.log(`[*] Node Server PID ${process.pid} started on port ${PORT}`);
});