// config/dbconfig.js
const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Whjb40r0.',
    server: 'localhost\\SQLEXPRESS',
    database: 'MQTTSISTEMA',
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    }
};

const dbConnection = new sql.ConnectionPool(config);

module.exports = dbConnection;
