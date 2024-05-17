const sql = require('mssql');
const dbConnection = require('../config/dbconfig');

exports.getAreas = async (req, res) => {
  try {
    const pool = await dbConnection.connect();
    const result = await pool.request().query('SELECT * FROM Areas');
    res.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).send('Error al obtener las áreas');
  }
};