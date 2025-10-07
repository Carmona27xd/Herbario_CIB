USE herbarium_CIB;

-- Insertar en la tabla Country
INSERT INTO Country (idCountry, name) VALUES (1, 'México');

-- Insertar en la tabla State
INSERT INTO State (name, idCountry) VALUES ('Jalisco', 1), ('Chiapas', 1), ('Yucatán', 1);

-- Insertar en la tabla Municipality
INSERT INTO Municipality (name, idState) VALUES ('Guadalajara', 1), ('Tuxtla Gutiérrez', 2), ('Mérida', 3);

-- Insertar en la tabla Locality
INSERT INTO Locality (name, idMunicipality) VALUES ('Zapopan', 1), ('San Cristóbal', 2), ('Progreso', 3);

-- Insertar en la tabla Family
INSERT INTO Family (name) VALUES ('Asteraceae'), ('Fabaceae'), ('Poaceae');

-- Insertar en la tabla Genus
INSERT INTO Genus (name) VALUES ('Quercus'), ('Pinus'), ('Opuntia');

-- Insertar en la tabla Species
INSERT INTO Species (name) VALUES ('Quercus rugosa'), ('Pinus cembroides'), ('Opuntia ficus-indica');

-- Insertar en la tabla SpeciesAuthor
INSERT INTO SpeciesAuthor (firstName, lastName, middleName) VALUES ('José', 'Martínez', 'Luis'), ('María', 'Gómez', 'Ana'), ('Carlos', 'Fernández', 'Juan');

-- Insertar en la tabla SpeciesAuthors
INSERT INTO SpeciesAuthors (idSpecies, idSpeciesAuthor) VALUES (1, 1), (2, 2), (3, 3);

-- Insertar en la tabla VegetationType
INSERT INTO VegetationType (name) VALUES ('Bosque templado'), ('Selva baja caducifolia'), ('Matorral xerófilo');

-- Insertar en la tabla Soil
INSERT INTO Soil (name) VALUES ('Arenoso'), ('Arcilloso'), ('Limoso');

-- Insertar en la tabla BiologicalForm
INSERT INTO BiologicalForm (name) VALUES ('Árbol'), ('Arbusto'), ('Hierba');

-- Insertar en la tabla Fruit
INSERT INTO Fruit (name) VALUES ('Nuez'), ('Baya'), ('Drupa');

-- Insertar en la tabla Flower
INSERT INTO Flower (name) VALUES ('Inflorescencia'), ('Solitaria'), ('Agrupada');

-- Insertar en la tabla Abundance
INSERT INTO Abundance (name) VALUES ('Raro'), ('Frecuente'), ('Abundante');

-- Insertar en la tabla PlantClassification
INSERT INTO PlantClassification (name) VALUES ('Endémica'), ('Nativa'), ('Introducida');

-- Insertar en la tabla Determiner
INSERT INTO Determiner (firstName, lastNameP, lastNameM, determinationDate) VALUES ('Luis', 'Hernández', 'Alberto', '2023-03-15'), ('Ana', 'Pérez', 'María', '2022-08-22'), ('Juan', 'Ramírez', 'Carlos', '2021-05-30');

-- Insertar en la tabla Specimen
INSERT INTO Specimen (idSpecimen, specimenState, associated, lifeCycle, size, duplicates, additionalData, protected, environmentalInformation, specimenImage, idVegetationType, idSoil, idBiologicalForm, idFruit, idFlower, idAbundance, idPlantClassification) 
VALUES ('SP001', TRUE, 'Con líquenes', 5, 2.5, 2, 'Datos adicionales', TRUE, 'Ambiente húmedo', 'imagen1.jpg', 1, 1, 1, 1, 1, 2, 1),
       ('SP002', FALSE, 'Con musgos', 3, 1.2, 3, 'Datos extras', FALSE, 'Ambiente seco', 'imagen2.jpg', 2, 2, 2, 2, 2, 1, 2),
       ('SP003', TRUE, 'En simbiosis', 4, 3.0, 1, 'Más información', TRUE, 'Zona templada', 'imagen3.jpg', 3, 3, 3, 3, 3, 3, 3);

-- Insertar en la tabla DeterminersSpecimens
INSERT INTO DeterminersSpecimens (idDeterminer, idSpecimen) VALUES (1, 'SP001'), (2, 'SP002'), (3, 'SP003');

-- Insertar en la tabla ScientificName
INSERT INTO ScientificName (name, isCurrent, assignmentDate, idSpecimen, idFamily, idGenus, idSpecies) VALUES ('Quercus rugosa', TRUE, '2023-04-10', 'SP001', 1, 1, 1), ('Pinus cembroides', TRUE, '2022-09-15', 'SP002', 2, 2, 2), ('Opuntia ficus-indica', TRUE, '2021-06-05', 'SP003', 3, 3, 3);

-- Insertar en la tabla Microhabitat
INSERT INTO Microhabitat (name) VALUES ('Bosque de pino-encino'), ('Selva mediana subcaducifolia'), ('Pastizal');

-- Insertar en la tabla Collection
INSERT INTO Collection (collectionNumber, localName, collectionDate, fieldNotebookImage, idSpecimen, idMicrohabitat) VALUES (101, 'Ejemplar 1', '2023-04-12', 'notebook1.jpg', 'SP001', 1), (102, 'Ejemplar 2', '2022-09-17', 'notebook2.jpg', 'SP002', 2), (103, 'Ejemplar 3', '2021-06-08', 'notebook3.jpg', 'SP003', 3);

-- Insertar en la tabla CollectionCollector
INSERT INTO CollectionCollector (idCollection, id_collector) VALUES (1, 1), (2, 2), (3, 3);

-- Insertar en la tabla CollectionAddress
INSERT INTO CollectionAddress (idCollection, idCountry, idState, idMunicipality, idLocality) VALUES (1, 1, 1, 1, 1), (2, 1, 2, 2, 2), (3, 1, 3, 3, 3);

-- Insertar en la tabla Coordinates
INSERT INTO Coordinates (latitude, longitude, altitude, idCollectionAddress) VALUES (20.6597, -103.3496, 1560, 1), (16.75, -93.1167, 522, 2), (20.97, -89.62, 8, 3);

-- Insertar en la tabla GMSCoordinates
INSERT INTO GMSCoordinates (longDegrees, longMinutes, longSeconds, latDegrees, latMinutes, latSeconds, idCollectionAddress) VALUES (103, 20, 15, 20, 39, 35, 1), (93, 7, 0, 16, 45, 0, 2), (89, 37, 12, 20, 58, 12, 3);
