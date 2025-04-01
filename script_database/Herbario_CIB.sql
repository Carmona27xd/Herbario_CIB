CREATE DATABASE herbario_CIB;
USE herbario_CIB;

-- Tabla de las Familias --
CREATE TABLE Familia (
	idFamilia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de las Especies --
CREATE TABLE Especie (
	idEspecie INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla Autor de las Especies
CREATE TABLE AutorEspecie (
	idAutorEspecie INT PRIMARY KEY AUTO_INCREMENT,
    nombres VARCHAR(100) NOT NULL,
    apellidoPaterno VARCHAR(100) NOT NULL,
    apellidoMaterno VARCHAR(100) NOT NULL
);

-- Tabla intermedia con relacion de Especies y el Autor de Especies
CREATE TABLE EspeciesAutores (
    idEspeciesAutores INT PRIMARY KEY AUTO_INCREMENT,
    idEspecie INT,
    idAutorEspecie INT,
    FOREIGN KEY (idEspecie) REFERENCES Especie(idEspecie) ON DELETE CASCADE,
    FOREIGN KEY (idAutorEspecie) REFERENCES AutorEspecie(idAutorEspecie) ON DELETE CASCADE
);

-- Tabla de los Generos --
CREATE TABLE Genero (
	idGenero INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla del Tipo de Vegetacion
CREATE TABLE TipoVegetacion (
	idTipoVegetacion INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla del Suelo
CREATE TABLE Suelo (
	idSuelo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de la Forma Biologica
CREATE TABLE FormaBiologica (
	idFormaBiologica INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla del fruto
CREATE TABLE Fruto (
	idFruto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de la Flor
CREATE TABLE Flor (
	idFlor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de la Abundancia
CREATE TABLE Abundancia (
	idAbundancia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de la clasificacion de la planta
CREATE TABLE ClasificacionPlanta (
	idClasificacionPlanta INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Se quito el not null de los apellidos y se agrego un not null a la fecha
-- Tabla del Determinador
CREATE TABLE Determinador (
	idDeterminador INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidoPaterno VARCHAR(50),
    apellidoMaterno VARCHAR(50),
    fechaDetermino DATE NOT NULL
);

-- Se agrego la informaionAmbiental del excel
-- Se agrego estadoEjemplar para el manejo de su disponibilidad
-- Tabla de los Ejemplares
CREATE TABLE Ejemplar (
	idEjemplar VARCHAR(30) PRIMARY KEY, -- Cambiado de int a varchar
    estadoEjemplar BOOLEAN NOT NULL, -- Agregado
    asociada VARCHAR(100),
    cicloVida INT, 
    tamanio FLOAT,
    duplicados INT NOT NULL,
    otrosDatos VARCHAR(400),
    protegido BOOLEAN NOT NULL,
    informacionAmbiental VARCHAR(400), -- Agregado
    imagenEjemplar VARCHAR(255),
    idTipoVegetacion INT,
    idSuelo INT,
    idFormaBiologica INT, 
    idFruto INT,
    idFlor INT, 
    idAbundancia INT NOT NULL,
    idClasificacionPlanta INT NOT NULL,
    FOREIGN KEY (idTipoVegetacion) REFERENCES TipoVegetacion(idTipoVegetacion) ON DELETE CASCADE,
    FOREIGN KEY (idSuelo) REFERENCES Suelo(idSuelo) ON DELETE CASCADE,
    FOREIGN KEY (idFormaBiologica) REFERENCES FormaBiologica(idFormaBiologica) ON DELETE CASCADE,
    FOREIGN KEY (idFruto) REFERENCES Fruto(idFruto) ON DELETE CASCADE,
    FOREIGN KEY (idFlor) REFERENCES Flor(idFlor) ON DELETE CASCADE,
    FOREIGN KEY (idAbundancia) REFERENCES Abundancia(idAbundancia) ON DELETE CASCADE,
    FOREIGN KEY (idClasificacionPlanta) REFERENCES ClasificacionPlanta(idClasificacionPlanta) ON DELETE CASCADE
);

-- Tabla intermedia con relacion de Determinadores y los Ejemplares 
CREATE TABLE DeterminadoresEjemplares (
    idDeterminadoresEjemplares INT PRIMARY KEY AUTO_INCREMENT,
    idDeterminador INT,
    idEjemplar VARCHAR(15),
    FOREIGN KEY (idDeterminador) REFERENCES Determinador(idDeterminador) ON DELETE CASCADE,
    FOREIGN KEY (idEjemplar) REFERENCES Ejemplar(idEjemplar) ON DELETE CASCADE
);

-- Se cambiaron a not null el genero y la especie
-- Tabla de los Nombres Cientificos
CREATE TABLE NombreCientifico (
	idNombreCientifico INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    esActual BOOLEAN NOT NULL,
    fechaAsignacion DATE NOT NULL,
    idEjemplar VARCHAR(15) NOT NULL,
    idFamilia INT NOT NULL,
    idGenero INT,
    idEspecie INT,
    FOREIGN KEY (idEjemplar) REFERENCES Ejemplar(idEjemplar) ON DELETE CASCADE,
    FOREIGN KEY (idFamilia) REFERENCES Familia(idFamilia) ON DELETE CASCADE,
    FOREIGN KEY (idGenero) REFERENCES Genero(idGenero) ON DELETE CASCADE,
    FOREIGN KEY (idEspecie) REFERENCES Especie(idEspecie) ON DELETE CASCADE
);

-- Tabla de las MicroHabitats
CREATE TABLE MicroHabitat (
	idMicroHabitat INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla Colecta
CREATE TABLE Colecta (
	idColecta INT PRIMARY KEY AUTO_INCREMENT,
    numeroColecta INT NOT NULL, 
    nombreLocal VARCHAR(100),
    fechaColecta DATE NOT NULL,
    imagenLibretaCampo VARCHAR(255),
    idEjemplar VARCHAR(15) NOT NULL,
    idMicroHabitat INT,
    FOREIGN KEY (idEjemplar) REFERENCES Ejemplar(idEjemplar) ON DELETE CASCADE,
    FOREIGN KEY (idMicroHabitat) REFERENCES MicroHabitat(idMicroHabitat) ON DELETE CASCADE
);

-- Tabla Colector
CREATE TABLE Colector (
	idColector INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidoPaterno VARCHAR(100) NOT NULL,
    apellidoMaterno VARCHAR(100) NOT NULL,
    permisoColecta LONGBLOB,
    prefijo VARCHAR(10),
    esAsociado BOOLEAN
);

-- Tabla de la relacion entre Colactas y Colectores
CREATE TABLE ColectaColector (
	idColectaColector INT PRIMARY KEY AUTO_INCREMENT,
    idColecta INT,
    idColector INT
);

-- Se creo la tabla de pais, pero no se si se utilizara, todos son de mexico
CREATE TABLE Pais (
	idPais INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50)
);

-- Tabla Estado
CREATE TABLE Estado (
	idEstado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    idPais INT NOT NULL, -- Se agrego
    FOREIGN KEY (idPais) REFERENCES Pais(idPais) ON DELETE CASCADE
);

-- Tabla Municipio
CREATE TABLE Municipio (
	idMunicipio INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    idEstado INT NOT NULL,
    FOREIGN KEY (idEstado) REFERENCES Estado(idEstado) ON DELETE CASCADE
);

-- Tabla Localidad
CREATE TABLE Localidad (
	idLocalidad INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    idMunicipio INT NOT NULL,
    FOREIGN KEY (idMunicipio) REFERENCES Municipio(idMunicipio) ON DELETE CASCADE
);

-- Tabla de la Direccion de la Colecta
CREATE TABLE DireccionColecta (
	idDireccionColecta INT PRIMARY KEY AUTO_INCREMENT,
    idColecta INT, 
    idPais INT,
    idEstado INT,
    idMunicipio INT,
    idLocalidad INT,
    FOREIGN KEY (idColecta) REFERENCES Colecta(idColecta) ON DELETE CASCADE,
    FOREIGN KEY (idEstado) REFERENCES Estado(idEstado) ON DELETE CASCADE,
    FOREIGN KEY (idMunicipio) REFERENCES Municipio(idMunicipio) ON DELETE CASCADE,
    FOREIGN KEY (idLocalidad) REFERENCES Localidad(idLocalidad) ON DELETE CASCADE
);

-- Tabla de las Coordenadas
CREATE TABLE Coordenadas (
	idCoordenadas INT PRIMARY KEY AUTO_INCREMENT,
    latitud DECIMAL(10, 6),
    longitud DECIMAL(10, 6),
    altitud DECIMAL(10, 2), 
    idDireccionColecta INT, -- Agregado
    FOREIGN KEY (idDireccionColecta) REFERENCES DireccionColecta(idDireccionColecta) ON DELETE CASCADE
);

-- Tabla para las coordenadas en GMS
CREATE TABLE CoordenadasGMS (
	idCoordenadasGMS INT PRIMARY KEY AUTO_INCREMENT,
    longGrados INT,
    longMin INT,
    longSegundos INT,
    latGrados INT,
    latMin INT,
    latSegundos INT,
    idDireccionColecta INT,
    FOREIGN KEY (idDireccionColecta) REFERENCES DireccionColecta(idDireccionColecta) ON DELETE CASCADE
);
