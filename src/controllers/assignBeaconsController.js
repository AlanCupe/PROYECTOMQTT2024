const sql = require('mssql');
const dbConnection = require('../config/dbconfig');

// Asignar un beacon a una persona
exports.assignBeacon = async (req, res) => {
    const { PersonaID, iBeaconID, Timestamp } = req.body;
    try {
        const pool = await dbConnection.connect();
        const query = `INSERT INTO AsignacionPersonasBeacons (PersonaID, iBeaconID, Timestamp) VALUES (@PersonaID, @iBeaconID, @Timestamp)`;
        await pool.request()
            .input('PersonaID', sql.Int, PersonaID)
            .input('iBeaconID', sql.Int, iBeaconID)
            .input('Timestamp', sql.DateTime, new Date(Timestamp))
            .query(query);
        res.json({ message: 'Beacon asignado correctamente' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al asignar beacon');
    }
};