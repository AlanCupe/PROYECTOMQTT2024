
CREATE DATABASE MQTTSISTEMA;

USE MQTTSISTEMA;

DROP DATABASE MQTTSISTEMA;

CREATE TABLE Gateway (
    GatewayID INT PRIMARY KEY IDENTITY(1,1),
    MacAddress NVARCHAR(50) NOT NULL,
    GatewayFree INT NULL,
    GatewayLoad FLOAT  NULL,
    Timestamp DATETIME NULL
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
	Timestamp DATETIME,
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
CREATE TABLE EventosBeacons (
    EventoID INT PRIMARY KEY IDENTITY(1,1),
    iBeaconID INT,
    GatewayID INT,
    TipoEvento NVARCHAR(10), -- 'Entrada' o 'Salida'
    Timestamp DATETIME,
    FOREIGN KEY (iBeaconID) REFERENCES iBeacon(iBeaconID),
    FOREIGN KEY (GatewayID) REFERENCES Gateway(GatewayID)
);

CREATE TABLE historial_asignaciones (
  HistorialID INT PRIMARY KEY IDENTITY(1,1), 
  PersonaID INT NOT NULL,
  iBeaconID INT NOT NULL,
  fechaAsignacion DATETIME NOT NULL,
  fechaBaja DATETIME,
  FOREIGN KEY (PersonaID) REFERENCES Personas(PersonaID),
  FOREIGN KEY (iBeaconID) REFERENCES iBeacon(iBeaconID)
);


CREATE TRIGGER insertar_asignacion
ON AsignacionPersonasBeacons
AFTER INSERT
AS
BEGIN
  INSERT INTO historial_asignaciones (PersonaID, iBeaconID, fechaAsignacion)
  SELECT PersonaID, iBeaconID, Timestamp
  FROM INSERTED;
END;

CREATE TRIGGER actualizar_asignacion
ON AsignacionPersonasBeacons
AFTER DELETE
AS
BEGIN
  UPDATE historial_asignaciones
  SET fechaBaja = GETUTCDATE()
  FROM historial_asignaciones
  INNER JOIN DELETED ON historial_asignaciones.iBeaconID = DELETED.iBeaconID
  AND historial_asignaciones.PersonaID = DELETED.PersonaID
  AND historial_asignaciones.fechaBaja IS NULL;
END;

DROP TRIGGER actualizar_asignacion

SELECT * FROM Personas;
SELECT * FROM Gateway;
SELECT * FROM iBeacon;
SELECT * FROM AsignacionBeacons;
SELECT * FROM Areas;
SELECT * FROM AsignacionGatewaysAreas;
SELECT * FROM AsignacionPersonasAreas;
SELECT * FROM AsignacionPersonasBeacons;
SELECT * FROM EventosBeacons;
SELECT * FROM Personas;
SELECT * FROM historial_asignaciones


DELETE FROM historial_asignaciones
DELETE FROM AsignacionPersonasBeacons
DELETE FROM EventosBeacons

DBCC CHECKIDENT('historial_asignaciones',RESEED,0);