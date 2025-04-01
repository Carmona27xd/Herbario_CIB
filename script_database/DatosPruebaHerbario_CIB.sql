USE herbario_CIB;

INSERT INTO Familia (nombre) VALUES 
('Asteraceae'),
('Fabaceae'),
('Lamiaceae');

-- Insertar Especies
INSERT INTO Especie (nombre) VALUES 
('Echinacea purpurea'),
('Acacia senegal'),
('Lavandula angustifolia');

-- Insertar Autores de Especies
INSERT INTO AutorEspecie (nombres, apellidoPaterno, apellidoMaterno) VALUES 
('Carlos', 'Linnaeus', 'Carlsson'),
('Joseph', 'Humboldt', 'Bonpland'),
('William', 'Robinson', 'Thompson');

-- Insertar EspeciesAutores
INSERT INTO EspeciesAutores (idEspecie, idAutorEspecie) VALUES 
(1, 1),
(2, 2),
(3, 3);

-- Insertar Generos
INSERT INTO Genero (nombre) VALUES 
('Echinacea'),
('Acacia'),
('Lavandula');

-- Insertar Tipo de Vegetacion
INSERT INTO TipoVegetacion (nombre) VALUES 
('Bosque'),
('Pradera'),
('Matorral');

-- Insertar Suelo
INSERT INTO Suelo (nombre) VALUES 
('Arenoso'),
('Arcilloso'),
('Limoso');

-- Insertar Forma Biologica
INSERT INTO FormaBiologica (nombre) VALUES 
('Arbusto'),
('Árbol'),
('Hierba');

-- Insertar Fruto
INSERT INTO Fruto (nombre) VALUES 
('Capsula'),
('Legumbre'),
('Drupa');

-- Insertar Flor
INSERT INTO Flor (nombre) VALUES 
('Copa'),
('Inflorescencia'),
('Cruzada');

-- Insertar Abundancia
INSERT INTO Abundancia (nombre) VALUES 
('Abundante'),
('Poca'),
('Moderada');

-- Insertar ClasificacionPlanta
INSERT INTO ClasificacionPlanta (nombre) VALUES 
('Primaria'),
('Secundaria');

-- Insertar Determinador
INSERT INTO Determinador (nombre, apellidoPaterno, apellidoMaterno, fechaDetermino) VALUES 
('Juan', 'Pérez', 'González', '2025-01-15'),
('Ana', 'Martínez', 'Sánchez', '2024-08-22'),
('Luis', 'Rodríguez', 'López', '2023-10-30');

-- Insertar Ejemplares
INSERT INTO Ejemplar (idEjemplar, estadoEjemplar, asociada, cicloVida, tamanio, duplicados, otrosDatos, protegido, informacionAmbiental, imagenEjemplar, idTipoVegetacion, idSuelo, idFormaBiologica, idFruto, idFlor, idAbundancia, idClasificacionPlanta) VALUES 
('EJ001', TRUE, 'Acacia', 2, 1.5, 0, 'Sin información adicional', FALSE, 'Datos ambientales', 'ejemplar1.jpg', 1, 1, 2, 2, 1, 1, 1),
('EJ002', TRUE, 'Lavandula', 1, 0.8, 1, 'Planta en flor', TRUE, 'Clima cálido', 'ejemplar2.jpg', 2, 2, 1, 3, 2, 2, 2),
('EJ003', FALSE, 'Echinacea', 3, 1.2, 2, 'Años de vida prolongados', TRUE, 'Suelo seco', 'ejemplar3.jpg', 3, 3, 3, 1, 3, 3, 1);

-- Insertar DeterminadoresEjemplares
INSERT INTO DeterminadoresEjemplares (idDeterminador, idEjemplar) VALUES 
(1, 'EJ001'),
(2, 'EJ002'),
(3, 'EJ003');

-- Insertar Nombres Cientificos
INSERT INTO NombreCientifico (nombre, esActual, fechaAsignacion, idEjemplar, idFamilia, idGenero, idEspecie) VALUES 
('Echinacea purpurea', TRUE, '2025-01-15', 'EJ001', 1, 1, 1),
('Acacia senegal', TRUE, '2024-08-22', 'EJ002', 2, 2, 2),
('Lavandula angustifolia', TRUE, '2023-10-30', 'EJ003', 3, 3, 3);

-- Insertar MicroHabitats
INSERT INTO MicroHabitat (nombre) VALUES 
('Bosque seco'),
('Pradera abierta'),
('Zona rocosa');

-- Insertar Colecta
INSERT INTO Colecta (numeroColecta, nombreLocal, fechaColecta, imagenLibretaCampo, idEjemplar, idMicroHabitat) VALUES 
(1001, 'Colección 1', '2025-03-01', 'libreta1.jpg', 'EJ001', 1),
(1002, 'Colección 2', '2025-03-02', 'libreta2.jpg', 'EJ002', 2),
(1003, 'Colección 3', '2025-03-03', 'libreta3.jpg', 'EJ003', 3);

-- Insertar Colectores
INSERT INTO Colector (nombre, apellidoPaterno, apellidoMaterno, permisoColecta, prefijo, esAsociado) VALUES 
('Pedro', 'Ramírez', 'Hernández', NULL, 'PR', TRUE),
('Marta', 'Gómez', 'López', NULL, 'MG', FALSE),
('José', 'Díaz', 'Sánchez', NULL, 'JD', TRUE);

-- Insertar ColectaColector
INSERT INTO ColectaColector (idColecta, idColector) VALUES 
(1, 1),
(2, 2),
(3, 3);

-- Insertar País
INSERT INTO Pais (nombre) VALUES 
('México'),
('México'),
('México');

-- Insertar Estado
INSERT INTO Estado (nombre, idPais) VALUES 
('Chiapas', 1),
('Veracruz', 1),
('Yucatán', 1);

-- Insertar Municipio
INSERT INTO Municipio (nombre, idEstado) VALUES 
('Tuxtla Gutiérrez', 1),
('Xalapa', 2),
('Mérida', 3);

-- Insertar Localidad
INSERT INTO Localidad (nombre, idMunicipio) VALUES 
('Las Vigas', 1),
('El Valle', 2),
('Santa Fe', 3);

-- Insertar Dirección Colecta
INSERT INTO DireccionColecta (idColecta, idEstado, idMunicipio, idLocalidad) VALUES 
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3);

-- Insertar Coordenadas
INSERT INTO Coordenadas (latitud, longitud, altitud, idDireccionColecta) VALUES 
(16.755, -93.112, 250.50, 1),
(19.520, -96.920, 100.00, 2),
(21.170, -89.199, 50.30, 3);

-- Insertar Coordenadas GMS
INSERT INTO CoordenadasGMS (longGrados, longMin, longSegundos, latGrados, latMin, latSegundos, idDireccionColecta) VALUES 
(93, 6, 43, 16, 45, 18, 1),
(96, 55, 12, 19, 31, 12, 2),
(89, 11, 6, 21, 10, 12, 3);