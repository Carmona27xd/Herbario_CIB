CREATE DATABASE herbarium_CIB;
USE herbarium_CIB;

-- Family Table --
CREATE TABLE Family (
    idFamily INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Species Table --
CREATE TABLE Species (
    idSpecies INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Species Author Table --
CREATE TABLE SpeciesAuthor (
    idSpeciesAuthor INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    middleName VARCHAR(100) NOT NULL
);

-- Intermediate Table: Species - Species Authors Relationship --
CREATE TABLE SpeciesAuthors (
    idSpeciesAuthors INT PRIMARY KEY AUTO_INCREMENT,
    idSpecies INT,
    idSpeciesAuthor INT,
    FOREIGN KEY (idSpecies) REFERENCES Species(idSpecies) ON DELETE CASCADE,
    FOREIGN KEY (idSpeciesAuthor) REFERENCES SpeciesAuthor(idSpeciesAuthor) ON DELETE CASCADE
);

-- Genus Table --
CREATE TABLE Genus (
    idGenus INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Vegetation Type Table --
CREATE TABLE VegetationType (
    idVegetationType INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Soil Table --
CREATE TABLE Soil (
    idSoil INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Biological Form Table --
CREATE TABLE BiologicalForm (
    idBiologicalForm INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Fruit Table --
CREATE TABLE Fruit (
    idFruit INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Flower Table --
CREATE TABLE Flower (
    idFlower INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Abundance Table --
CREATE TABLE Abundance (
    idAbundance INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Plant Classification Table --
CREATE TABLE PlantClassification (
    idPlantClassification INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Determiner Table --
CREATE TABLE Determiner (
    idDeterminer INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastNameP VARCHAR(50),
    lastNameM VARCHAR(50),
    determinationDate DATE NOT NULL
);

-- Specimen Table --
CREATE TABLE Specimen (
    idSpecimen VARCHAR(30) PRIMARY KEY, -- Changed from INT to VARCHAR
    specimenState BOOLEAN NOT NULL, 
    associated VARCHAR(100),
    lifeCycle INT, 
    size FLOAT,
    duplicates INT NOT NULL,
    additionalData VARCHAR(400),
    protected BOOLEAN NOT NULL,
    environmentalInformation VARCHAR(400),
    specimenImage VARCHAR(255),
    idVegetationType INT,
    idSoil INT,
    idBiologicalForm INT, 
    idFruit INT,
    idFlower INT, 
    idAbundance INT NOT NULL,
    idPlantClassification INT NOT NULL,
    FOREIGN KEY (idVegetationType) REFERENCES VegetationType(idVegetationType) ON DELETE CASCADE,
    FOREIGN KEY (idSoil) REFERENCES Soil(idSoil) ON DELETE CASCADE,
    FOREIGN KEY (idBiologicalForm) REFERENCES BiologicalForm(idBiologicalForm) ON DELETE CASCADE,
    FOREIGN KEY (idFruit) REFERENCES Fruit(idFruit) ON DELETE CASCADE,
    FOREIGN KEY (idFlower) REFERENCES Flower(idFlower) ON DELETE CASCADE,
    FOREIGN KEY (idAbundance) REFERENCES Abundance(idAbundance) ON DELETE CASCADE,
    FOREIGN KEY (idPlantClassification) REFERENCES PlantClassification(idPlantClassification) ON DELETE CASCADE
);

-- Intermediate Table: Determiners - Specimens Relationship --
CREATE TABLE DeterminersSpecimens (
    idDeterminersSpecimens INT PRIMARY KEY AUTO_INCREMENT,
    idDeterminer INT,
    idSpecimen VARCHAR(15),
    FOREIGN KEY (idDeterminer) REFERENCES Determiner(idDeterminer) ON DELETE CASCADE,
    FOREIGN KEY (idSpecimen) REFERENCES Specimen(idSpecimen) ON DELETE CASCADE
);

-- Scientific Names Table --
CREATE TABLE ScientificName (
    idScientificName INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    isCurrent BOOLEAN NOT NULL,
    assignmentDate DATE NOT NULL,
    idSpecimen VARCHAR(15) NOT NULL,
    idFamily INT NOT NULL,
    idGenus INT,
    idSpecies INT,
    FOREIGN KEY (idSpecimen) REFERENCES Specimen(idSpecimen) ON DELETE CASCADE,
    FOREIGN KEY (idFamily) REFERENCES Family(idFamily) ON DELETE CASCADE,
    FOREIGN KEY (idGenus) REFERENCES Genus(idGenus) ON DELETE CASCADE,
    FOREIGN KEY (idSpecies) REFERENCES Species(idSpecies) ON DELETE CASCADE
);

-- Microhabitat Table --
CREATE TABLE Microhabitat (
    idMicrohabitat INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Collection Table --
CREATE TABLE Collection (
    idCollection INT PRIMARY KEY AUTO_INCREMENT,
    collectionNumber INT NOT NULL, 
    localName VARCHAR(100),
    collectionDate DATE NOT NULL,
    fieldNotebookImage VARCHAR(255),
    idSpecimen VARCHAR(15) NOT NULL,
    idMicrohabitat INT,
    FOREIGN KEY (idSpecimen) REFERENCES Specimen(idSpecimen) ON DELETE CASCADE,
    FOREIGN KEY (idMicrohabitat) REFERENCES Microhabitat(idMicrohabitat) ON DELETE CASCADE
);

-- Collector Table --
CREATE TABLE `collector` (
  `id_collector` int NOT NULL AUTO_INCREMENT,
  `names` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `first_surname` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `second_surname` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ascription` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `pdf_file` longblob NOT NULL,
  `is_associated` tinyint DEFAULT NULL,
  `prefix` char(10) DEFAULT NULL,
  `id_collection` int DEFAULT NULL,
  `pdf_filename` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_collector`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Intermediate Table: Collections - Collectors Relationship --
CREATE TABLE CollectionCollector (
    idCollectionCollector INT PRIMARY KEY AUTO_INCREMENT,
    idCollection INT,
    id_collector INT
);

-- Country Table --
CREATE TABLE Country (
    idCountry INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);

-- State Table --
CREATE TABLE State (
    idState INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    idCountry INT NOT NULL, 
    FOREIGN KEY (idCountry) REFERENCES Country(idCountry) ON DELETE CASCADE
);

-- Municipality Table --
CREATE TABLE Municipality (
    idMunicipality INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    idState INT NOT NULL,
    FOREIGN KEY (idState) REFERENCES State(idState) ON DELETE CASCADE
);

-- Locality Table --
CREATE TABLE Locality (
    idLocality INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    idMunicipality INT NOT NULL,
    FOREIGN KEY (idMunicipality) REFERENCES Municipality(idMunicipality) ON DELETE CASCADE
);

-- Collection Address Table --
CREATE TABLE CollectionAddress (
    idCollectionAddress INT PRIMARY KEY AUTO_INCREMENT,
    idCollection INT, 
    idCountry INT,
    idState INT,
    idMunicipality INT,
    idLocality INT,
    FOREIGN KEY (idCollection) REFERENCES Collection(idCollection) ON DELETE CASCADE,
    FOREIGN KEY (idState) REFERENCES State(idState) ON DELETE CASCADE,
    FOREIGN KEY (idMunicipality) REFERENCES Municipality(idMunicipality) ON DELETE CASCADE,
    FOREIGN KEY (idLocality) REFERENCES Locality(idLocality) ON DELETE CASCADE
);

-- Coordinates Table --
CREATE TABLE Coordinates (
    idCoordinates INT PRIMARY KEY AUTO_INCREMENT,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    altitude DECIMAL(10, 2), 
    idCollectionAddress INT, 
    FOREIGN KEY (idCollectionAddress) REFERENCES CollectionAddress(idCollectionAddress) ON DELETE CASCADE
);

-- GMS Coordinates Table --
CREATE TABLE GMSCoordinates (
    idGMSCoordinates INT PRIMARY KEY AUTO_INCREMENT,
    longDegrees INT,
    longMinutes INT,
    longSeconds INT,
    latDegrees INT,
    latMinutes INT,
    latSeconds INT,
    idCollectionAddress INT,
    FOREIGN KEY (idCollectionAddress) REFERENCES CollectionAddress(idCollectionAddress) ON DELETE CASCADE
);

--Collector Requests Table--
CREATE TABLE collector_requests (
    id_request INT AUTO_INCREMENT PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    first_surname NVARCHAR(100) NOT NULL,
    second_surname NVARCHAR(100),
    email NVARCHAR(255) NOT NULL,
    adscription NVARCHAR(255) NOT NULL,
    documents LONGBLOB NOT NULL,
    documents_name NVARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
