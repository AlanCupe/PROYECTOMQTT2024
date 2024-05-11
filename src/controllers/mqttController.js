const dbConnection = require('../config/dbconfig');
const sql = require('mssql');

dbConnection.connect()
    .then(pool => {
        console.log('Conexión exitosa a la base de datos');
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err);
    });

const handleMQTTMessage = async (req, res) => {
    const { topic, message } = req.body;

    console.log('Mensaje MQTT recibido:');
    console.log('Tema:', topic);
    console.log('Mensaje:', message);

    try {
        const parsedMessage = JSON.parse(message); // Parsear el mensaje JSON
        console.log('Mensaje MQTT analizado:', parsedMessage);

        for (const item of parsedMessage) {
            if (item.type === 'Gateway') {
                const gatewayData = {
                    MacAddress: item.mac,
                    GatewayFree: item.gatewayFree,
                    GatewayLoad: item.gatewayLoad,
                    Timestamp: new Date(item.timestamp)
                };

                console.log('Datos del Gateway a insertar en la base de datos:', gatewayData);

                const gatewayQuery = `IF NOT EXISTS (SELECT 1 FROM Gateway WHERE MacAddress = @MacAddress)
                                        BEGIN
                                            INSERT INTO Gateway (MacAddress, GatewayFree, GatewayLoad, Timestamp) 
                                            VALUES (@MacAddress, @GatewayFree, @GatewayLoad, @Timestamp)
                                        END
                                        ELSE
                                        BEGIN
                                            UPDATE Gateway 
                                            SET MacAddress = @MacAddress, GatewayFree = @GatewayFree, GatewayLoad = @GatewayLoad, Timestamp = @Timestamp 
                                            WHERE MacAddress = @MacAddress
                                        END`;
                await dbConnection.request()
                    .input('GatewayID', sql.NVarChar(50), gatewayData.GatewayID)
                    .input('MacAddress', sql.NVarChar(50), gatewayData.MacAddress)
                    .input('GatewayFree', sql.Int, gatewayData.GatewayFree)
                    .input('GatewayLoad', sql.Float, gatewayData.GatewayLoad)
                    .input('Timestamp', sql.DateTime, gatewayData.Timestamp)
                    .query(gatewayQuery);

                console.log('Datos del Gateway insertados o actualizados en la base de datos correctamente');
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

                console.log('Datos del iBeacon a insertar en la base de datos:', iBeaconData);

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

                console.log('Datos del iBeacon insertados o actualizados en la base de datos correctamente');
            } else {
                console.error('Tipo de dispositivo no reconocido');
            }
        }

        res.status(200).json({ message: 'Mensaje MQTT recibido y procesado correctamente' });
    } catch (error) {
        console.error('Error al analizar el mensaje MQTT:', error);
        res.status(400).json({ error: 'Error al analizar el mensaje MQTT: ' + error.message });
    }
};

module.exports = { handleMQTTMessage };
