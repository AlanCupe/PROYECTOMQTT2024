// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mqttRoutes = require('./src/routes/mqttRoutes');
const personRoutes = require('./src/routes/personRoutes');
const beaconRoutes = require('./src/routes/beaconRoutes');
const assignBeacons = require('./src/routes/assignBeacons');

app.use('/mqtt', mqttRoutes);
app.use('/personas', personRoutes);
app.use('/beacons', beaconRoutes);
app.use('/assignbeacon', assignBeacons);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});
