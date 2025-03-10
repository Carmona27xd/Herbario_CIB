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

-- Tabla del Determinador
CREATE TABLE Determinador (
	idDeterminador INT PRIMARY KEY AUTO_INCREMENT,
    nombres VARCHAR(100) NOT NULL,
    apellidoPaterno VARCHAR(50) NOT NULL,
    apellidoMaterno VARCHAR(50) NOT NULL,
    fechaDetermino DATE
);

-- Tabla de los Ejemplares
CREATE TABLE Ejemplar (
	idEjemplar INT PRIMARY KEY AUTO_INCREMENT,
    asociada VARCHAR(100) NOT NULL,
    cicloVida INT NOT NULL, 
    tamanio FLOAT NOT NULL,
    duplicados INT NOT NULL,
    otrosDatos VARCHAR(200) NOT NULL,
    protegido BOOLEAN,
    imagenEjemplar BLOB,
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
    idEjemplar INT,
    FOREIGN KEY (idDeterminador) REFERENCES Determinador(idDeterminador) ON DELETE CASCADE,
    FOREIGN KEY (idEjemplar) REFERENCES Ejemplar(idEjemplar) ON DELETE CASCADE
);

-- Tabla de los Nombres Cientificos
CREATE TABLE NombreCientifico (
	idNombreCientifico INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    esActual BOOLEAN NOT NULL,
    fechaAsignacion DATE,
    idEjemplar INT NOT NULL,
    idFamilia INT NOT NULL,
    idGenero INT NOT NULL,
    idEspecie INT NOT NULL,
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
    numeroColecta INT, 
    nombreLocal VARCHAR(100) NOT NULL,
    fechaColecta DATE,
    idEjemplar INT,
    idMicroHabitat INT,
    FOREIGN KEY (idEjemplar) REFERENCES Ejemplar(idEjemplar) ON DELETE CASCADE,
    FOREIGN KEY (idMicroHabitat) REFERENCES MicroHabitat(idMicroHabitat) ON DELETE CASCADE
);

-- Tabla Colector
CREATE TABLE Colector (
	idColector INT PRIMARY KEY AUTO_INCREMENT,
    nombres VARCHAR(100) NOT NULL,
    apellidoPaterno VARCHAR(100) NOT NULL,
    apellidoMaterno VARCHAR(100) NOT NULL,
    permisoColecta LONGBLOB,
    prefijo VARCHAR(10),
    esAsociado BOOLEAN,
    idColecta INT,
    FOREIGN KEY (idColecta) REFERENCES Colecta(idColecta) ON DELETE CASCADE
);

-- Tabla Estado
CREATE TABLE Estado (
	idEstado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla Municipio
CREATE TABLE Municipio (
	idMunicipio INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    idEstado INT,
    FOREIGN KEY (idEstado) REFERENCES Estado(idEstado) ON DELETE CASCADE
);

-- Tabla Localidad
CREATE TABLE Localidad (
	idLocalidad INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    idMunicipio INT,
    FOREIGN KEY (idMunicipio) REFERENCES Municipio(idMunicipio) ON DELETE CASCADE
);

-- Tabla de la Direccion de la Colecta
CREATE TABLE DireccionColecta (
	idDireccionColecta INT PRIMARY KEY AUTO_INCREMENT,
    idColecta INT, 
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
    latitud DECIMAL(10, 6) NOT NULL,
    longitud DECIMAL(10, 6) NOT NULL,
    altitud DECIMAL(10, 2) NULL
);


