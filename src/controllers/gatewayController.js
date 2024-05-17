const sql = require('mssql');
const dbConnection = require('../config/dbconfig');

const getAllGatewaysMac = async (req, res) => {
    try {
        console.log('Intentando conectar a la base de datos...');
        const pool = await dbConnection.connect();
        console.log('Conexión a la base de datos exitosa.');
        const result = await pool.request().query('SELECT MacAddress FROM Gateway');
        console.log('Consulta ejecutada exitosamente.');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener las direcciones MAC de los gateways:', error);
        res.status(500).json({ error: 'Error al obtener las direcciones MAC de los gateways: ' + error.message });
    }
};

module.exports = { getAllGatewaysMac };
