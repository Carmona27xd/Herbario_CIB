-- 1. Actualizar vista de NO PROTEGIDOS
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
  AND s.is_validated = 1  -- <--- AQUÍ ESTÁ EL CAMBIO IMPORTANTE
GROUP BY s.idSpecimen, f.name, g.name, sp.name, s.specimenImage;


-- 2. Actualizar vista de PROTEGIDOS
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
  AND s.is_validated = 1  -- <--- AQUÍ ESTÁ EL CAMBIO IMPORTANTE
GROUP BY s.idSpecimen, f.name, g.name, sp.name;