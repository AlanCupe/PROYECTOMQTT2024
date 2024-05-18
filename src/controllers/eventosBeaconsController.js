const dbConnection = require('../config/dbconfig');
const sql = require('mssql');

dbConnection.connect()
    .then(pool => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err);
    });

const getEventosBeacons = async (req, res) => {
    try {
        const query = `SELECT * FROM EventosBeacons`;
        const result = await dbConnection.request().query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        res.status(500).json({ error: 'Error al obtener los eventos' });
    }
};

module.exports = { getEventosBeacons };
