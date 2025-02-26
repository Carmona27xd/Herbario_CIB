-- Creacion de la base de datos para el proyecto
CREATE DATABASE herbarioUV;
USE herbarioUV;

-- Tablas base primero
CREATE TABLE Familia (
    idFamilia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100)
);

CREATE TABLE Genero (
    idGenero INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100)
);

CREATE TABLE TipoVegetacion (
    idTipoVegetacion INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100)
);

CREATE TABLE Suelo (
    idSuelo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100)
);

CREATE TABLE FormaBiologica (
    idFormaBiologica INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100)
);

CREATE TABLE Determinador (
    idDeterminador INT PRIMARY KEY AUTO_INCREMENT,
    nombreCompleto VARCHAR(255),
    fechaDeterminacion DATETIME
);

CREATE TABLE Microhabitat (
    idMicrohabitat INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100)
);

CREATE TABLE Abundancia (
    idAbundancia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100)
);

-- Tablas relacionadas con nombres científicos
CREATE TABLE NombreCientifico (
    idNombreCientifico INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    esActual BOOLEAN,
    fechaAsignacion DATETIME,
    idGenero INT,
    idFamilia INT,
    FOREIGN KEY (idGenero) REFERENCES Genero(idGenero),
    FOREIGN KEY (idFamilia) REFERENCES Familia(idFamilia)
);

CREATE TABLE Especie (
    idEspecie INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    idFamilia INT,
    FOREIGN KEY (idFamilia) REFERENCES Familia(idFamilia)
);

CREATE TABLE AutoEspecie (
    idAutoEspecie INT PRIMARY KEY AUTO_INCREMENT,
    informacion TEXT,
    idEspecie INT,
    FOREIGN KEY (idEspecie) REFERENCES Especie(idEspecie)
);

-- Tabla Ejemplar con sus relaciones corregidas
CREATE TABLE Ejemplar (
    idEjemplar INT PRIMARY KEY AUTO_INCREMENT,
    acceso VARCHAR(100),
    idEjemplarExt BIGINT,
    protegido BOOLEAN,
    tamanio VARCHAR(50),
    edad VARCHAR(50),
    descripcionIdentificacion VARCHAR(255),
    identificador VARCHAR(100),
    otraClave VARCHAR(100),
    idDeterminador INT,
    idFormaBiologica INT,
    idSuelo INT,
    idTipoVegetacion INT,
    FOREIGN KEY (idDeterminador) REFERENCES Determinador(idDeterminador),
    FOREIGN KEY (idFormaBiologica) REFERENCES FormaBiologica(idFormaBiologica),
    FOREIGN KEY (idSuelo) REFERENCES Suelo(idSuelo),
    FOREIGN KEY (idTipoVegetacion) REFERENCES TipoVegetacion(idTipoVegetacion)
);

-- Tabla Usuario y sus derivados
CREATE TABLE Usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    password VARCHAR(255),
    fechaCreacion DATETIME,
    tipoUsuario ENUM('Normal', 'Técnico') NOT NULL DEFAULT 'Normal'
);

CREATE TABLE Consulta (
    idUsuarioConsulta INT PRIMARY KEY,
    nombre VARCHAR(100),
    FOREIGN KEY (idUsuarioConsulta) REFERENCES Usuario(idUsuario)
);

CREATE TABLE Investigador (
    idUsuarioInvestigador INT PRIMARY KEY,
    nombre VARCHAR(100),
    primerApellido VARCHAR(100),
    segundoApellido VARCHAR(100),
    CV LONGBLOB,
    nombreReferencia VARCHAR(100),
    FOREIGN KEY (idUsuarioInvestigador) REFERENCES Usuario(idUsuario)
);

CREATE TABLE SolicitudConsulta (
    idSolicitud INT PRIMARY KEY AUTO_INCREMENT,
    personaContacto TEXT,
    actividadSolicitada TEXT,
    fechaSolicitud DATETIME,
    cartaCompromiso TEXT,
    estatus VARCHAR(50),
    idUsuario INT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

-- Tabla Colector
CREATE TABLE Colector (
    idColector INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    primerApellido VARCHAR(100),
    segundoApellido VARCHAR(100),
    personaContacto TEXT,
    fechaColecta DATETIME,
    autorizado BOOLEAN
);

CREATE TABLE DireccionColecta (
    idDireccionColecta INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(100),
    municipio VARCHAR(100),
    localidad VARCHAR(100)
);

CREATE TABLE Coordenadas (
    idCoordenadas INT PRIMARY KEY AUTO_INCREMENT,
    latitud VARCHAR(50),
    longitud VARCHAR(50)
);

-- Relaciones entre Microhabitat, Abundancia y Colecta
CREATE TABLE Colecta (
    idColecta INT PRIMARY KEY AUTO_INCREMENT,
    idMicrohabitat INT,
    idAbundancia INT,
    FOREIGN KEY (idMicrohabitat) REFERENCES Microhabitat(idMicrohabitat),
    FOREIGN KEY (idAbundancia) REFERENCES Abundancia(idAbundancia)
);

-- Tabla Flor y Fruto relacionadas a Ejemplar
CREATE TABLE Flor (
    idFlor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    tipo VARCHAR(100),
    idEjemplar INT,
    FOREIGN KEY (idEjemplar) REFERENCES Ejemplar(idEjemplar)
);

CREATE TABLE Fruto (
    idFruto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    idEjemplar INT,
    FOREIGN KEY (idEjemplar) REFERENCES Ejemplar(idEjemplar)
);
