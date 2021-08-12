const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'employees'
    },
    console.log('Connected to the employees db.')
);

module.exports = db;