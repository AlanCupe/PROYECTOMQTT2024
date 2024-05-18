const dbConnection = require('../config/dbconfig');
const sql = require('mssql');

dbConnection.connect()
    .then(pool => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err);
    });

const RSSI_THRESHOLD = -100; // Ajusta este valor según sea necesario
const CHECK_INTERVAL = 5000; // Ajusta el intervalo a 5 segundos

const handleMQTTMessage = async (req, res) => {
    const { topic, message } = req.body;
    console.log('Mensaje MQTT recibido:', { topic, message });

    const gatewayMac = topic.split('/')[2];
    const now = new Date();

    try {
        const parsedMessage = JSON.parse(message);
        console.log('Mensaje MQTT analizado:', parsedMessage);

        const detectedBeacons = new Set();

        for (const item of parsedMessage) {
            if (item.type === 'Gateway') {
                const gatewayData = {
                    MacAddress: item.mac,
                    GatewayFree: item.gatewayFree,
                    GatewayLoad: item.gatewayLoad,
                    Timestamp: new Date(item.timestamp)
                };

                const gatewayQuery = `IF NOT EXISTS (SELECT 1 FROM Gateway WHERE MacAddress = @MacAddress)
                                      BEGIN
                                          INSERT INTO Gateway (MacAddress, GatewayFree, GatewayLoad, Timestamp) 
                                          VALUES (@MacAddress, @GatewayFree, @GatewayLoad, @Timestamp)
                                      END
                                      ELSE
                                      BEGIN
                                          UPDATE Gateway 
                                          SET GatewayFree = @GatewayFree, GatewayLoad = @GatewayLoad, Timestamp = @Timestamp 
                                          WHERE MacAddress = @MacAddress
                                      END`;

                await dbConnection.request()
                    .input('MacAddress', sql.NVarChar(50), gatewayData.MacAddress)
                    .input('GatewayFree', sql.Int, gatewayData.GatewayFree)
                    .input('GatewayLoad', sql.Float, gatewayData.GatewayLoad)
                    .input('Timestamp', sql.DateTime, gatewayData.Timestamp)
                    .query(gatewayQuery);

            } else if (item.type === 'iBeacon') {
                const iBeaconData = {
                    MacAddress: item.mac,
                    RSSI: item.rssi,
                    iBeaconUuid: item.ibeaconUuid,
                    iBeaconMajor: item.ibeaconMajor,
                    iBeaconMinor: item.ibeaconMinor,
                    iBeaconTxPower: item.ibeaconTxPower,
                    Battery: item.battery,
                    Timestamp: new Date(item.timestamp)
                };

                if (iBeaconData.RSSI >= RSSI_THRESHOLD) {
                    detectedBeacons.add(iBeaconData.MacAddress);

                    const iBeaconQuery = `IF NOT EXISTS (SELECT 1 FROM iBeacon WHERE MacAddress = @MacAddress)
                                          BEGIN
                                              INSERT INTO iBeacon (MacAddress, RSSI, iBeaconUuid, iBeaconMajor, iBeaconMinor, iBeaconTxPower, Battery, Timestamp) 
                                              VALUES (@MacAddress, @RSSI, @iBeaconUuid, @iBeaconMajor, @iBeaconMinor, @iBeaconTxPower, @Battery, @Timestamp)
                                          END
                                          ELSE
                                          BEGIN
                                              UPDATE iBeacon 
                                              SET RSSI = @RSSI, iBeaconUuid = @iBeaconUuid, iBeaconMajor = @iBeaconMajor, iBeaconMinor = @iBeaconMinor, 
                                                  iBeaconTxPower = @iBeaconTxPower, Battery = @Battery, Timestamp = @Timestamp 
                                              WHERE MacAddress = @MacAddress
                                          END`;

                    await dbConnection.request()
                        .input('MacAddress', sql.NVarChar(50), iBeaconData.MacAddress)
                        .input('RSSI', sql.Int, iBeaconData.RSSI)
                        .input('iBeaconUuid', sql.NVarChar(50), iBeaconData.iBeaconUuid)
                        .input('iBeaconMajor', sql.Int, iBeaconData.iBeaconMajor)
                        .input('iBeaconMinor', sql.Int, iBeaconData.iBeaconMinor)
                        .input('iBeaconTxPower', sql.Int, iBeaconData.iBeaconTxPower)
                        .input('Battery', sql.Int, iBeaconData.Battery)
                        .input('Timestamp', sql.DateTime, iBeaconData.Timestamp)
                        .query(iBeaconQuery);

                    const gatewayQuery = `SELECT GatewayID FROM Gateway WHERE MacAddress = @GatewayMac`;
                    const result = await dbConnection.request()
                        .input('GatewayMac', sql.NVarChar(50), gatewayMac)
                        .query(gatewayQuery);

                    if (result.recordset.length > 0) {
                        const gatewayID = result.recordset[0].GatewayID;

                        // Obtener todos los eventos almacenados en la tabla EventosBeacons
                        const allEventsQuery = `SELECT TipoEvento, Timestamp FROM EventosBeacons 
                                                WHERE iBeaconID = (SELECT iBeaconID FROM iBeacon WHERE MacAddress = @MacAddress) 
                                                  AND GatewayID = @GatewayID`;
                        const allEventsResult = await dbConnection.request()
                            .input('MacAddress', sql.NVarChar(50), iBeaconData.MacAddress)
                            .input('GatewayID', sql.Int, gatewayID)
                            .query(allEventsQuery);

                        // Verificar si ya existe un evento de entrada registrado
                        const newEventType = 'Entrada';
                        const lastEvent = allEventsResult.recordset.length > 0 ? allEventsResult.recordset[allEventsResult.recordset.length - 1] : null;
                        const lastEventType = lastEvent ? lastEvent.TipoEvento : null;
                        const lastEventTimestamp = lastEvent ? new Date(lastEvent.Timestamp) : null;

                        if (lastEventType !== newEventType && (!lastEventTimestamp || (now - lastEventTimestamp) > CHECK_INTERVAL)) {
                            const eventoQuery = `INSERT INTO EventosBeacons (iBeaconID, GatewayID, TipoEvento, Timestamp)
                                                 VALUES ((SELECT iBeaconID FROM iBeacon WHERE MacAddress = @MacAddress), @GatewayID, @TipoEvento, @Timestamp)`;

                            await dbConnection.request()
                                .input('MacAddress', sql.NVarChar(50), iBeaconData.MacAddress)
                                .input('GatewayID', sql.Int, gatewayID)
                                .input('TipoEvento', sql.NVarChar(10), newEventType)
                                .input('Timestamp', sql.DateTime, iBeaconData.Timestamp)
                                .query(eventoQuery);
                        } else {
                            console.log(`Evento de entrada ya registrado para el iBeacon con MacAddress: ${iBeaconData.MacAddress}`);
                        }
                    }
                } else {
                    console.log(`El beacon con MacAddress: ${iBeaconData.MacAddress} tiene RSSI bajo el umbral y no se considera en rango.`);
                }
            } else {
                console.error('Tipo de dispositivo no reconocido');
            }
        }

        // Actualizar los eventos a "Salida" para los iBeacons que ya no están en el rango del gateway
        const gatewayQuery = `SELECT GatewayID FROM Gateway WHERE MacAddress = @GatewayMac`;
        const result = await dbConnection.request()
            .input('GatewayMac', sql.NVarChar(50), gatewayMac)
            .query(gatewayQuery);

        if (result.recordset.length > 0) {
            const gatewayID = result.recordset[0].GatewayID;
            const beaconsQuery = `SELECT iBeaconID, MacAddress, Timestamp FROM iBeacon WHERE iBeaconID IN (
                                  SELECT iBeaconID FROM EventosBeacons WHERE GatewayID = @GatewayID AND TipoEvento = 'Entrada')`;
            const beaconsResult = await dbConnection.request()
                .input('GatewayID', sql.Int, gatewayID)
                .query(beaconsQuery);

            for (const row of beaconsResult.recordset) {
                if (!detectedBeacons.has(row.MacAddress) && (now - new Date(row.Timestamp)) > CHECK_INTERVAL) {
                    const lastEventQuery = `SELECT TOP 1 TipoEvento, Timestamp FROM EventosBeacons 
                                            WHERE iBeaconID = @iBeaconID 
                                              AND GatewayID = @GatewayID 
                                            ORDER BY Timestamp DESC`;
                    const lastEventResult = await dbConnection.request()
                        .input('iBeaconID', sql.Int, row.iBeaconID)
                        .input('GatewayID', sql.Int, gatewayID)
                        .query(lastEventQuery);

                    const lastEventType = lastEventResult.recordset.length > 0 ? lastEventResult.recordset[0].TipoEvento : null;
                    const lastEventTimestamp = lastEventResult.recordset.length > 0 ? new Date(lastEventResult.recordset[0].Timestamp) : null;
                    const newEventType = 'Salida';

                    // Registrar evento solo si el estado ha cambiado y la diferencia de tiempo no es inferior al intervalo de verificación
                    if (lastEventType !== newEventType && (!lastEventTimestamp || (now - lastEventTimestamp) > CHECK_INTERVAL)) {
                        const eventoQuery = `INSERT INTO EventosBeacons (iBeaconID, GatewayID, TipoEvento, Timestamp)
                                             VALUES (@iBeaconID, @GatewayID, @TipoEvento, @Timestamp)`;

                        await dbConnection.request()
                            .input('iBeaconID', sql.Int, row.iBeaconID)
                            .input('GatewayID', sql.Int, gatewayID)
                            .input('TipoEvento', sql.NVarChar(10), newEventType)
                            .input('Timestamp', sql.DateTime, now)
                            .query(eventoQuery);

                        console.log(`Evento de salida registrado para el iBeacon con MacAddress: ${row.MacAddress}`);
                    }
                }
            }
        }

        res.status(200).json({ message: 'Mensaje MQTT recibido y procesado correctamente' });
    } catch (error) {
        console.error('Error al analizar el mensaje MQTT:', error);
        res.status(400).json({ error: 'Error al analizar el mensaje MQTT: ' + error.message });
    }
};

module.exports = { handleMQTTMessage };
