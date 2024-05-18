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

// Obtener todos los Gateways
const getGateways = async (req, res) => {
    try {
        const pool = await dbConnection.connect();
        const result = await pool.request().query('SELECT * FROM Gateway');
        res.json(result.recordset);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al obtener los Gateways');
    }
};

// Crear un nuevo Gateway
const createGateway = async (req, res) => {
    const { MacAddress, Nombre } = req.body;
    try {
        const pool = await dbConnection.connect();
        await pool.request()
            .input('MacAddress', sql.NVarChar, MacAddress)
            .input('Nombre', sql.NVarChar, Nombre)
            .query('INSERT INTO Gateway (MacAddress, Nombre) VALUES (@MacAddress, @Nombre)');
        res.status(201).send('Gateway creado exitosamente');
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al crear el Gateway');
    }
};

// Actualizar un Gateway
const updateGateway = async (req, res) => {
    const { id } = req.params;
    const { MacAddress, Nombre } = req.body;
    try {
        const pool = await dbConnection.connect();
        await pool.request()
            .input('GatewayID', sql.Int, id)
            .input('MacAddress', sql.NVarChar, MacAddress)
            .input('Nombre', sql.NVarChar, Nombre)
            .query('UPDATE Gateway SET MacAddress = @MacAddress, Nombre = @Nombre WHERE GatewayID = @GatewayID');
        res.send('Gateway actualizado exitosamente');
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al actualizar el Gateway');
    }
};

// Eliminar un Gateway
const deleteGateway = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await dbConnection.connect();
        await pool.request()
            .input('GatewayID', sql.Int, id)
            .query('DELETE FROM Gateway WHERE GatewayID = @GatewayID');
        res.send('Gateway eliminado exitosamente');
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al eliminar el Gateway');
    }
};

module.exports = { getAllGatewaysMac, getGateways, createGateway, updateGateway, deleteGateway };

