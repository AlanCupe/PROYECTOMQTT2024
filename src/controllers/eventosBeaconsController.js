const dbConnection = require('../config/dbconfig');
const sql = require('mssql');

dbConnection.connect()
    .then(pool => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err);
    });

exports.getAllEventos = async (req, res) => {
try {
    const query = `SELECT * FROM EventosBeacons`;
    const result = await dbConnection.request().query(query);
    res.status(200).json(result.recordset);
} catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ error: 'Error al obtener los eventos' });
}
};

exports.getAllEventos2 = async (req, res) => {
    try {
        const pool = await dbConnection.connect();
        const result = await pool.request().query(`
            SELECT 
                e.EventoID,
                e.GatewayID,
                e.TipoEvento,
                e.Timestamp,
                i.MacAddress,
                COALESCE(p.Nombre + ' ' + p.Apellido, i.MacAddress) AS BeaconDisplayName
            FROM 
                EventosBeacons e
                JOIN iBeacon i ON e.iBeaconID = i.iBeaconID
                LEFT JOIN AsignacionPersonasBeacons apb ON e.iBeaconID = apb.iBeaconID
                LEFT JOIN Personas p ON apb.PersonaID = p.PersonaID
        `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error al obtener los eventos de beacons');
    }
};
