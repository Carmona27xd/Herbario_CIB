DELIMITER $$

CREATE PROCEDURE RegistrarEjemplarCompleto(
    -- Datos del ejemplar
    IN p_asociada VARCHAR(100),
    IN p_cicloVida INT,
    IN p_tamanio FLOAT,
    IN p_duplicados INT,
    IN p_otrosDatos VARCHAR(200),
    IN p_protegido BOOLEAN,
    IN p_imagenEjemplar BLOB,
    IN p_idTipoVegetacion INT,
    IN p_idSuelo INT,
    IN p_idFormaBiologica INT,
    IN p_idFruto INT,
    IN p_idFlor INT,
    IN p_idAbundancia INT,
    IN p_idClasificacionPlanta INT,

    -- Datos del determinador
    IN p_nombresDet VARCHAR(100),
    IN p_apellidoPaternoDet VARCHAR(50),
    IN p_apellidoMaternoDet VARCHAR(50),
    IN p_fechaDetermino DATE,

    -- Datos de la colecta
    IN p_numeroColecta INT,
    IN p_nombreLocal VARCHAR(100),
    IN p_fechaColecta DATE,
    IN p_idMicroHabitat INT,

    -- Datos de los colectores (Se espera una lista separada por comas de IDs)
    IN p_colectores TEXT,

    -- Datos de la dirección de colecta
    IN p_idEstado INT,
    IN p_idMunicipio INT,
    IN p_idLocalidad INT,

    -- Datos de las coordenadas
    IN p_latitud DECIMAL(10, 6),
    IN p_longitud DECIMAL(10, 6),
    IN p_altitud DECIMAL(10, 2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error al registrar los datos';
    END;

    START TRANSACTION;

    -- 1. Insertar el ejemplar
    INSERT INTO Ejemplar (asociada, cicloVida, tamanio, duplicados, otrosDatos, protegido, imagenEjemplar, 
                          idTipoVegetacion, idSuelo, idFormaBiologica, idFruto, idFlor, idAbundancia, idClasificacionPlanta)
    VALUES (p_asociada, p_cicloVida, p_tamanio, p_duplicados, p_otrosDatos, p_protegido, p_imagenEjemplar,
            p_idTipoVegetacion, p_idSuelo, p_idFormaBiologica, p_idFruto, p_idFlor, p_idAbundancia, p_idClasificacionPlanta);
    
    SET @idEjemplar = LAST_INSERT_ID();

    -- 2. Insertar el determinador si no existe
    SET @idDeterminador = NULL;
    SELECT idDeterminador INTO @idDeterminador
    FROM Determinador
    WHERE nombres = p_nombresDet AND apellidoPaterno = p_apellidoPaternoDet AND apellidoMaterno = p_apellidoMaternoDet;

    IF @idDeterminador IS NULL THEN
        INSERT INTO Determinador (nombres, apellidoPaterno, apellidoMaterno, fechaDetermino)
        VALUES (p_nombresDet, p_apellidoPaternoDet, p_apellidoMaternoDet, p_fechaDetermino);
        SET @idDeterminador = LAST_INSERT_ID();
    END IF;

    -- 3. Asociar el determinador con el ejemplar
    INSERT INTO DeterminadoresEjemplares (idDeterminador, idEjemplar)
    VALUES (@idDeterminador, @idEjemplar);

    -- 4. Insertar la colecta
    INSERT INTO Colecta (numeroColecta, nombreLocal, fechaColecta, idEjemplar, idMicroHabitat)
    VALUES (p_numeroColecta, p_nombreLocal, p_fechaColecta, @idEjemplar, p_idMicroHabitat);

    SET @idColecta = LAST_INSERT_ID();

    -- 5. Asociar colectores a la colecta
    IF p_colectores IS NOT NULL AND p_colectores != '' THEN
        SET @query = CONCAT('INSERT INTO ColectaColector (idColecta, idColector) 
                            SELECT ', @idColecta, ', idColector FROM Colector WHERE FIND_IN_SET(idColector, ''', p_colectores, ''')');
        PREPARE stmt FROM @query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    -- 6. Insertar la dirección de colecta
    INSERT INTO DireccionColecta (idColecta, idEstado, idMunicipio, idLocalidad)
    VALUES (@idColecta, p_idEstado, p_idMunicipio, p_idLocalidad);

    SET @idDireccionColecta = LAST_INSERT_ID();

    -- 7. Insertar las coordenadas
    INSERT INTO Coordenadas (latitud, longitud, altitud)
    VALUES (p_latitud, p_longitud, p_altitud);

    COMMIT;
END $$

DELIMITER ;



