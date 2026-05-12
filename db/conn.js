const mysql = require('mysql2/promise'); // Raw SQL

// Connection Pool

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true, // To implement users in queue if resouece full
    connectionLimit: 100,
    queueLimit: 0,
})