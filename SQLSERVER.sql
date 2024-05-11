CREATE DATABASE MQTTSISTEMA;

USE MQTTSISTEMA;

DROP DATABASE MQTTSISTEMA;

CREATE TABLE Gateway (
    GatewayID INT PRIMARY KEY IDENTITY(1,1),
    MacAddress NVARCHAR(50) NOT NULL,
    GatewayFree INT NOT NULL,
    GatewayLoad FLOAT NOT NULL,
    Timestamp DATETIME
);

-- Tabla iBeacon
CREATE TABLE iBeacon (
    iBeaconID INT PRIMARY KEY IDENTITY(1,1),
    MacAddress NVARCHAR(50) NOT NULL,
    BleNo INT NULL,
    BleName NVARCHAR(100),
    iBeaconUuid NVARCHAR(50) NOT NULL,
    iBeaconMajor INT NOT NULL,
    iBeaconMinor INT NOT NULL,
    Rssi INT NOT NULL,
    iBeaconTxPower INT NOT NULL,
    Battery INT,
    Timestamp DATETIME
);

SELECT * FROM Gateway;
SELECT * FROM iBeacon;



CREATE TABLE Personas (
    PersonaID INT PRIMARY KEY IDENTITY,
    Nombre NVARCHAR(100) NOT NULL,
	Apellido NVARCHAR(100) NOT NULL,
    Dni NVARCHAR(8) NOT NULL,
    Cargo NVARCHAR(100) NOT NULL,
	Empresa NVARCHAR(100) NOT NULL
);




-- Tabla AsignacionBeacons
CREATE TABLE AsignacionBeacons (
    iBeaconID INT,
    GatewayID INT,
    FOREIGN KEY (iBeaconID) REFERENCES iBeacon(iBeaconID),
    FOREIGN KEY (GatewayID) REFERENCES Gateway(GatewayID)
);

CREATE TABLE Areas (
    AreaID INT PRIMARY KEY IDENTITY,
    Nombre NVARCHAR(100) NOT NULL
);

-- Crear la tabla de asignación entre Gateways y Áreas
CREATE TABLE AsignacionGatewaysAreas(
    id INT PRIMARY KEY IDENTITY,
    AreaID INT,
    GatewayID INT,
    FOREIGN KEY (AreaID) REFERENCES Areas(AreaID),
    FOREIGN KEY (GatewayID) REFERENCES Gateway(GatewayID)
);

CREATE TABLE AsignacionPersonasAreas (
    AsignacionID INT PRIMARY KEY IDENTITY,
    PersonaID INT,
    AreaID INT,
    Timestamp DATETIME,
    FOREIGN KEY (PersonaID) REFERENCES Personas(PersonaID),
    FOREIGN KEY (AreaID) REFERENCES Areas(AreaID)
);

CREATE TABLE AsignacionPersonasBeacons (
    AsignacionID INT PRIMARY KEY IDENTITY,
    PersonaID INT,
    iBeaconID INT,
    Timestamp DATETIME,
    FOREIGN KEY (PersonaID) REFERENCES Personas(PersonaID),
    FOREIGN KEY (iBeaconID) REFERENCES iBeacon(iBeaconID)
);


INSERT INTO Personas
VALUES
('Terry','Garcia','77889988','Programador','Amazon'),
('Diego','Aparcana','44558866','Analista','Alibaba'),
('Terry','Garcia','77889988','Desarrollador','Petro Perú');

-- Insertar datos en la tabla Gateway
INSERT INTO Gateway (GatewayID, MacAddress, GatewayFree, GatewayLoad, Timestamp)
VALUES (1, 'AC233FC18D06', 93, 0.01, '2024-05-05T18:25:55.514Z');

INSERT INTO Gateway (GatewayID, MacAddress, GatewayFree, GatewayLoad, Timestamp)
VALUES (2, 'AC233FC18CFB', 93, 0.01, '2024-05-05T18:25:55.514Z');

INSERT INTO Gateway (GatewayID, MacAddress, GatewayFree, GatewayLoad, Timestamp)
VALUES (3, 'AC233FC18CF8', 93, 0.01, '2024-05-05T18:25:55.514Z');

-- Insertar datos en la tabla iBeacon
INSERT INTO iBeacon (iBeaconID, MacAddress, BleNo, BleName, iBeaconUuid, iBeaconMajor, iBeaconMinor, Rssi, iBeaconTxPower, Battery, Timestamp)
VALUES 
(1, 'C3000014B1C1', 0, '', 'E2C56DB5DFFB48D2B060D0F5A71096E0', 0, 0, -52, -59, 0, '2024-05-05T18:25:59.680Z'),
(2, 'C3000014B1D4', 0, '', 'E2C56DB5DFFB48D2B060D0F5A71096E0', 0, 0, -52, -59, 0, '2024-05-05T18:25:59.678Z'),
(3, 'C30000174E44', 0, '', 'E2C56DB5DFFB48D2B060D0F5A71096E0', 0, 0, -52, -59, 0, '2024-05-05T18:25:59.341Z');

-- Agrega más registros según sea necesario
INSERT INTO iBeacon (iBeaconID, MacAddress, BleNo, BleName, iBeaconUuid, iBeaconMajor, iBeaconMinor, Rssi, iBeaconTxPower, Battery, Timestamp)
VALUES 
(4, 'C300001B3D71', 0, '', 'E2C56DB5DFFB48D2B060D0F5A71096E0', 0, 0, -52, -59, 0, '2024-05-05T18:25:59.680Z'),
(5, 'C300001B3D72', 0, '', 'E2C56DB5DFFB48D2B060D0F5A71096E0', 0, 0, -52, -59, 0, '2024-05-05T18:25:59.678Z'),
(6, 'C300001B3D73', 0, '', 'E2C56DB5DFFB48D2B060D0F5A71096E0', 0, 0, -52, -59, 0, '2024-05-05T18:25:59.341Z');

INSERT INTO iBeacon (iBeaconID, MacAddress, BleNo, BleName, iBeaconUuid, iBeaconMajor, iBeaconMinor, Rssi, iBeaconTxPower, Battery, Timestamp)
VALUES 
(7, 'C300001B3A40', 0, '', 'E2C56DB5DFFB48D2B060D0F5A71096E0', 0, 0, -52, -59, 0, '2024-05-05T18:25:59.680Z'),
(8, 'C300001B3A41', 0, '', 'E2C56DB5DFFB48D2B060D0F5A71096E0', 0, 0, -52, -59, 0, '2024-05-05T18:25:59.678Z'),
(9, 'C300001B3A43', 0, '', 'E2C56DB5DFFB48D2B060D0F5A71096E0', 0, 0, -52, -59, 0, '2024-05-05T18:25:59.341Z');

-- Insertar asignación de beacons a Gateway en la tabla AsignacionBeacons
INSERT INTO AsignacionBeacons (iBeaconID, GatewayID)
VALUES 
(1, 1), -- Beacon 1 asignado al Gateway 1
(2, 1), -- Beacon 2 asignado al Gateway 1
(3, 1); -- Beacon 3 asignado al Gateway 1

-- Insertar áreas
INSERT INTO Areas (Nombre) 
VALUES 
('Superficie'), 
('Inicio Mina'), 
('Comedor');

INSERT INTO AsignacionGatewaysAreas
VALUES
(1,1),
(2,2);

INSERT INTO AsignacionPersonasBeacons (PersonaID, iBeaconID, Timestamp)
VALUES 
(1, 1, '2024-05-08 10:00:00'), -- Asignar iBeacon 1 a la Persona 1
(2, 2, '2024-05-08 10:00:00'), -- Asignar iBeacon 2 a la Persona 2
(3, 3, '2024-05-08 10:00:00'); -- Asignar iBeacon 3 a la Persona 3


-- Registrar la asociación de una persona con un área en un momento específico
INSERT INTO AsignacionPersonasAreas (PersonaID, AreaID, Timestamp)
VALUES (1, 1, '2024-05-08 10:00:00');
INSERT INTO AsignacionPersonasAreas (PersonaID, AreaID, Timestamp)
VALUES (2, 2, '2024-05-08 10:00:00');
INSERT INTO AsignacionPersonasAreas (PersonaID, AreaID, Timestamp)
VALUES (3, 3, '2024-05-08 10:00:00');

SELECT * FROM Personas;
SELECT * FROM Gateway;
SELECT * FROM iBeacon;
SELECT * FROM AsignacionBeacons;
SELECT * FROM Areas;
SELECT * FROM AsignacionGatewaysAreas;
SELECT * FROM AsignacionPersonasAreas;
SELECT * FROM AsignacionPersonasBeacons;
