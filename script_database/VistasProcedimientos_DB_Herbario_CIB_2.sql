USE herbarium_CIB;

DELIMITER $$
CREATE PROCEDURE TP_RegistrarEjemplar(

    -- Datos del ejemplar
    IN p_idEjemplar VARCHAR(30),
    IN p_asociada VARCHAR(100),
    IN p_cicloVida INT,
    IN p_tamanio FLOAT,
    IN p_duplicados INT,
    IN p_otrosDatos VARCHAR(200),
    IN p_protegido BOOLEAN,
    IN p_informacionAmbiental VARCHAR(400),
    IN p_imagenEjemplar VARCHAR(255),
    IN p_idTipoVegetacion INT,
    IN p_idSuelo INT,
    IN p_idFormaBiologica INT,
    IN p_idFruto INT,
    IN p_idFlor INT,
    IN p_idAbundancia INT,
    IN p_idClasificacionPlanta INT,

    -- Datos del determinador
    IN p_nombreDet VARCHAR(100),
    IN p_apellidoPaternoDet VARCHAR(50),
    IN p_apellidoMaternoDet VARCHAR(50),

    -- Datos de la colecta
    IN p_numeroColecta INT,
    IN p_nombreLocal VARCHAR(100),
    IN p_fechaColecta DATE,
    IN p_idMicroHabitat INT,
    IN p_imagenLibretaCampo VARCHAR(255),

    -- Datos de los colectores (Lista separada por comas de IDs)
    IN p_colectores TEXT,

    -- Datos de la dirección de colecta
    IN p_idEstado INT,
    IN p_idMunicipio INT,
    IN p_idLocalidad INT,

    -- Datos de las coordenadas
    IN p_latitud DECIMAL(10, 6),
    IN p_longitud DECIMAL(10, 6),
    IN p_altitud DECIMAL(10, 2),

    -- Datos de las coordenadas en GMS
    IN p_longGrados INT,
    IN p_longMin INT,
    IN p_longSegundos INT,
    IN p_latGrados INT,
    IN p_latMin INT,
    IN p_latSegundos INT,
    
    -- Datos del nombre científico
    IN p_nombreCient VARCHAR(100),
    IN p_idFamilia INT,
    IN p_idGenero INT,
    IN p_idEspecie INT
)
BEGIN
    DECLARE v_idDeterminador INT;
    DECLARE v_idColecta INT;
    DECLARE v_idDireccionColecta INT;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al registrar los datos';
    END;

    START TRANSACTION;
    
    SELECT 'Paso 1' AS Mensaje;

    -- 1. Insertar el ejemplar con el ID proporcionado por el usuario
    INSERT INTO Specimen (
        idSpecimen, specimenState, associated, lifeCycle, size, duplicates, additionalData, protected, environmentalInformation, 
        specimenImage, idVegetationType, idSoil, idBiologicalForm, idFruit, idFlower, idAbundance, idPlantClassification
        )
    VALUES (
        p_idEjemplar, TRUE, p_asociada, p_cicloVida, p_tamanio, p_duplicados, p_otrosDatos, 
        p_protegido, p_informacionAmbiental, p_imagenEjemplar, p_idTipoVegetacion, p_idSuelo, p_idFormaBiologica, 
        p_idFruto, p_idFlor, p_idAbundancia, p_idClasificacionPlanta);
    
    SELECT 'Paso 2' AS Mensaje;
    
    -- 2. Insertar o recuperar el determinador
    SELECT idDeterminer INTO v_idDeterminador
    FROM Determiner
    WHERE firstName = p_nombreDet AND lastNameP = p_apellidoPaternoDet AND lastNameM = p_apellidoMaternoDet
    LIMIT 1;
    
    SELECT 'Paso 3' AS Mensaje;

    IF v_idDeterminador IS NULL THEN
        INSERT INTO Determiner (firstName, lastNameP, lastNameM, determinationDate)
        VALUES (p_nombreDet, p_apellidoPaternoDet, p_apellidoMaternoDet, CURRENT_DATE);
        SET v_idDeterminador = LAST_INSERT_ID();
    END IF;
    
    SELECT 'Paso 4' AS Mensaje;

    -- 3. Asociar el determinador con el ejemplar
    INSERT INTO DeterminersSpecimens (idDeterminer, idSpecimen)
    VALUES (v_idDeterminador, p_idEjemplar);
    
    SELECT 'Paso 5' AS Mensaje;

    -- 4. Insertar la colecta
    INSERT INTO Collection (collectionNumber, localName, collectionDate, fieldNotebookImage, idSpecimen, idMicrohabitat)
    VALUES (p_numeroColecta, p_nombreLocal, p_fechaColecta, p_imagenLibretaCampo, p_idEjemplar, p_idMicroHabitat);
    
    SELECT 'Paso 6' AS Mensaje;

    SET v_idColecta = LAST_INSERT_ID();
    
    SELECT 'Paso 7' AS Mensaje;

    -- 5. Asociar colectores a la colecta
    IF p_colectores IS NOT NULL AND p_colectores != '' THEN
        INSERT INTO CollectionCollector (idCollection, id_collector)
        SELECT v_idColecta, id_collector FROM Collector WHERE FIND_IN_SET(id_collector, p_colectores);
    END IF;
    
    SELECT 'Paso 8' AS Mensaje;

    -- 6. Insertar la dirección de colecta
    INSERT INTO CollectionAddress (idCollection, idCountry, idState, idMunicipality, idLocality)
    VALUES (v_idColecta, 1, p_idEstado, p_idMunicipio, p_idLocalidad);
    
    SELECT 'Paso 9' AS Mensaje;

    SET v_idDireccionColecta = LAST_INSERT_ID();
    
    SELECT 'Paso 10' AS Mensaje;

    -- 7. Insertar las coordenadas en formato decimal
    INSERT INTO Coordinates (latitude, longitude, altitude, idCollectionAddress)
    VALUES (p_latitud, p_longitud, p_altitud, v_idDireccionColecta);
    
    SELECT 'Paso 11' AS Mensaje;

    -- 8. Insertar las coordenadas en formato GMS
    INSERT INTO GMSCoordinates (longDegrees, longMinutes, longSeconds, latDegrees, latMinutes, latSeconds, idCollectionAddress)
    VALUES (p_longGrados, p_longMin, p_longSegundos, p_latGrados, p_latMin, p_latSegundos, v_idDireccionColecta);
    
    SELECT 'Paso 12' AS Mensaje;

    -- 9. Insertar el nombre científico
    INSERT INTO ScientificName (name, isCurrent, assignmentDate, idSpecimen, idFamily, idGenus, idSpecies)
    VALUES (p_nombreCient, TRUE, CURRENT_DATE, p_idEjemplar, p_idFamilia, p_idGenero, p_idEspecie);
    
    SELECT 'Paso 13' AS Mensaje;

    COMMIT;
END $$
DELIMITER ;

-- Views
CREATE VIEW VistaEjemplarDetalles AS
SELECT 
    s.idSpecimen,
    sn.name AS ScientificName,
    pc.name AS PlantClassification,
    a.name AS Abundance
FROM Specimen s
JOIN ScientificName sn ON s.idSpecimen = sn.idSpecimen
JOIN PlantClassification pc ON s.idPlantClassification = pc.idPlantClassification
JOIN Abundance a ON s.idAbundance = a.idAbundance
WHERE s.specimenState = 1;















-- Cambiar el nombre de la vista y agregarla en el script
CREATE OR REPLACE VIEW vista_coordenadas_ejemplares AS
SELECT 
    s.idSpecimen,
    c.idCollection,
    ca.idCollectionAddress,
    co.latitude,
    co.longitude,
    co.altitude
FROM Specimen s
JOIN Collection c ON s.idSpecimen = c.idSpecimen
JOIN CollectionAddress ca ON c.idCollection = ca.idCollection
JOIN Coordinates co ON ca.idCollectionAddress = co.idCollectionAddress;




CREATE VIEW viewDetailsSpecimensPopup AS
SELECT 
  s.idSpecimen,
  sn.name AS scientificName,
  f.name AS family,
  st.name AS state,
  m.name AS municipality,
  vt.name AS vegetationType,
  so.name AS soil,
  s.environmentalInformation,
  bf.name AS biologicalForm,
  s.associated AS associated,
  s.size,
  s.lifeCycle,
  fl.name AS flower,
  fr.name AS fruit,
  c.localName,
  s.specimenImage
FROM Specimen s
LEFT JOIN ScientificName sn ON sn.idSpecimen = s.idSpecimen AND sn.isCurrent = 1
LEFT JOIN Family f ON f.idFamily = sn.idFamily
LEFT JOIN VegetationType vt ON vt.idVegetationType = s.idVegetationType
LEFT JOIN Soil so ON so.idSoil = s.idSoil
LEFT JOIN BiologicalForm bf ON bf.idBiologicalForm = s.idBiologicalForm
LEFT JOIN Flower fl ON fl.idFlower = s.idFlower
LEFT JOIN Fruit fr ON fr.idFruit = s.idFruit
LEFT JOIN Collection c ON c.idSpecimen = s.idSpecimen
LEFT JOIN CollectionAddress ca ON ca.idCollection = c.idCollection
LEFT JOIN State st ON st.idState = ca.idState
LEFT JOIN Municipality m ON m.idMunicipality = ca.idMunicipality;


CREATE OR REPLACE VIEW vista_ejemplares_geograficos AS
SELECT 
    s.idSpecimen,
    f.name AS family,
    g.name AS genus,
    sp.name AS species,
    s.specimenImage AS image_url,
    COUNT(DISTINCT c.collectionNumber) AS records,
    st.idState,
    m.idMunicipality,
    l.idLocality,
    co.altitude,
    co.latitude,
    co.longitude
FROM Specimen s
-- Nombre científico actual
JOIN ScientificName sn ON sn.idSpecimen = s.idSpecimen AND sn.isCurrent = 1
-- Familia, Género y Especie
LEFT JOIN Family f ON sn.idFamily = f.idFamily
LEFT JOIN Genus g ON sn.idGenus = g.idGenus
LEFT JOIN Species sp ON sn.idSpecies = sp.idSpecies
-- Colectas
LEFT JOIN Collection c ON c.idSpecimen = s.idSpecimen
-- Dirección de la colecta
LEFT JOIN CollectionAddress ca ON ca.idCollection = c.idCollection
LEFT JOIN State st ON ca.idState = st.idState
LEFT JOIN Municipality m ON ca.idMunicipality = m.idMunicipality
LEFT JOIN Locality l ON ca.idLocality = l.idLocality
-- Coordenadas
LEFT JOIN Coordinates co ON co.idCollectionAddress = ca.idCollectionAddress
GROUP BY 
    s.idSpecimen, f.name, g.name, sp.name, s.specimenImage, 
    st.idState, m.idMunicipality, l.idLocality, 
    co.altitude, co.latitude, co.longitude;
    
    





CREATE OR REPLACE VIEW vista_ejemplares_no_protegidos AS
SELECT 
    s.idSpecimen,
    f.name AS familia,
    g.name AS genero,
    sp.name AS especie,
    s.specimenImage,
    COUNT(DISTINCT c.collectionNumber) AS registros
FROM Specimen s
JOIN ScientificName sn ON sn.idSpecimen = s.idSpecimen AND sn.isCurrent = 1
LEFT JOIN Family f ON sn.idFamily = f.idFamily
LEFT JOIN Genus g ON sn.idGenus = g.idGenus
LEFT JOIN Species sp ON sn.idSpecies = sp.idSpecies
LEFT JOIN Collection c ON c.idSpecimen = s.idSpecimen
WHERE s.protected = 0
GROUP BY s.idSpecimen, f.name, g.name, sp.name, s.specimenImage;

CREATE OR REPLACE VIEW vista_ejemplares_protegidos AS
SELECT 
    s.idSpecimen,
    f.name AS familia,
    g.name AS genero,
    sp.name AS especie,
    COUNT(DISTINCT c.collectionNumber) AS registros
FROM Specimen s
JOIN ScientificName sn ON sn.idSpecimen = s.idSpecimen AND sn.isCurrent = 1
LEFT JOIN Family f ON sn.idFamily = f.idFamily
LEFT JOIN Genus g ON sn.idGenus = g.idGenus
LEFT JOIN Species sp ON sn.idSpecies = sp.idSpecies
LEFT JOIN Collection c ON c.idSpecimen = s.idSpecimen
WHERE s.protected = 1
GROUP BY s.idSpecimen, f.name, g.name, sp.name;