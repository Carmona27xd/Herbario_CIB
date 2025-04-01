USE herbario_CIB;

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
    INSERT INTO Ejemplar (
        idEjemplar, estadoEjemplar, asociada, cicloVida, tamanio, duplicados, otrosDatos, protegido, informacionAmbiental, 
        imagenEjemplar, idTipoVegetacion, idSuelo, idFormaBiologica, idFruto, idFlor, idAbundancia, idClasificacionPlanta
        )
    VALUES (
        p_idEjemplar, TRUE, p_asociada, p_cicloVida, p_tamanio, p_duplicados, p_otrosDatos, 
        p_protegido, p_informacionAmbiental, p_imagenEjemplar, p_idTipoVegetacion, p_idSuelo, p_idFormaBiologica, 
        p_idFruto, p_idFlor, p_idAbundancia, p_idClasificacionPlanta);
    
    SELECT 'Paso 2' AS Mensaje;
    
    -- 2. Insertar o recuperar el determinador
    SELECT idDeterminador INTO v_idDeterminador
    FROM Determinador
    WHERE nombre = p_nombreDet AND apellidoPaterno = p_apellidoPaternoDet AND apellidoMaterno = p_apellidoMaternoDet
    LIMIT 1;
    
    SELECT 'Paso 3' AS Mensaje;

    IF v_idDeterminador IS NULL THEN
        INSERT INTO Determinador (nombre, apellidoPaterno, apellidoMaterno, fechaDetermino)
        VALUES (p_nombreDet, p_apellidoPaternoDet, p_apellidoMaternoDet, CURRENT_DATE);
        SET v_idDeterminador = LAST_INSERT_ID();
    END IF;
    
    SELECT 'Paso 4' AS Mensaje;

    -- 3. Asociar el determinador con el ejemplar
    INSERT INTO DeterminadoresEjemplares (idDeterminador, idEjemplar)
    VALUES (v_idDeterminador, p_idEjemplar);
    
    SELECT 'Paso 5' AS Mensaje;

    -- 4. Insertar la colecta
    INSERT INTO Colecta (numeroColecta, nombreLocal, fechaColecta, imagenLibretaCampo, idEjemplar, idMicroHabitat)
    VALUES (p_numeroColecta, p_nombreLocal, p_fechaColecta, p_imagenLibretaCampo, p_idEjemplar, p_idMicroHabitat);
    
    SELECT 'Paso 6' AS Mensaje;

    SET v_idColecta = LAST_INSERT_ID();
    
    SELECT 'Paso 7' AS Mensaje;

    -- 5. Asociar colectores a la colecta
    IF p_colectores IS NOT NULL AND p_colectores != '' THEN
        INSERT INTO ColectaColector (idColecta, idColector)
        SELECT v_idColecta, idColector FROM Colector WHERE FIND_IN_SET(idColector, p_colectores);
    END IF;
    
    SELECT 'Paso 8' AS Mensaje;

    -- 6. Insertar la dirección de colecta
    INSERT INTO DireccionColecta (idColecta, idPais, idEstado, idMunicipio, idLocalidad)
    VALUES (v_idColecta, 1, p_idEstado, p_idMunicipio, p_idLocalidad);
    
    SELECT 'Paso 9' AS Mensaje;

    SET v_idDireccionColecta = LAST_INSERT_ID();
    
    SELECT 'Paso 10' AS Mensaje;

    -- 7. Insertar las coordenadas en formato decimal
    INSERT INTO Coordenadas (latitud, longitud, altitud, idDireccionColecta)
    VALUES (p_latitud, p_longitud, p_altitud, v_idDireccionColecta);
    
    SELECT 'Paso 11' AS Mensaje;

    -- 8. Insertar las coordenadas en formato GMS
    INSERT INTO CoordenadasGMS (longGrados, longMin, longSegundos, latGrados, latMin, latSegundos, idDireccionColecta)
    VALUES (p_longGrados, p_longMin, p_longSegundos, p_latGrados, p_latMin, p_latSegundos, v_idDireccionColecta);
    
    SELECT 'Paso 12' AS Mensaje;

    -- 9. Insertar el nombre científico
    INSERT INTO NombreCientifico (nombre, esActual, fechaAsignacion, idEjemplar, idFamilia, idGenero, idEspecie)
    VALUES (p_nombreCient, TRUE, CURRENT_DATE, p_idEjemplar, p_idFamilia, p_idGenero, p_idEspecie);
    
    SELECT 'Paso 13' AS Mensaje;

    COMMIT;
END $$
DELIMITER ;

-- Vistas
CREATE VIEW VistaEjemplarDetalles AS
SELECT 
    e.idEjemplar,
    nc.nombre AS NombreCientifico,
    cp.nombre AS ClasificacionPlanta,
    a.nombre AS Abundancia
FROM Ejemplar e
JOIN NombreCientifico nc ON e.idEjemplar = nc.idEjemplar
JOIN ClasificacionPlanta cp ON e.idClasificacionPlanta = cp.idClasificacionPlanta
JOIN Abundancia a ON e.idAbundancia = a.idAbundancia
WHERE e.estadoEjemplar = 1;
