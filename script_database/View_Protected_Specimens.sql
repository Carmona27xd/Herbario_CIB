USE herbarium_CIB;
CREATE VIEW ProtectedSpecimens AS
SELECT 
    s.idSpecimen,
    s.associated,
    s.size,
    s.duplicates,
    s.additionalData,
    s.environmentalInformation,
    s.specimenImage,
    f.name AS family,
    g.name AS genus,
    sp.name AS species,
    vt.name AS vegetationType,
    so.name AS soil,
    bf.name AS biologicalForm,
    fr.name AS fruit,
    fl.name AS flower,
    ab.name AS abundance,
    pc.name AS plantClassification
FROM Specimen s
LEFT JOIN ScientificName sn ON sn.idSpecimen = s.idSpecimen AND sn.isCurrent = 1
LEFT JOIN Family f ON sn.idFamily = f.idFamily
LEFT JOIN Genus g ON sn.idGenus = g.idGenus
LEFT JOIN Species sp ON sn.idSpecies = sp.idSpecies
LEFT JOIN VegetationType vt ON s.idVegetationType = vt.idVegetationType
LEFT JOIN Soil so ON s.idSoil = so.idSoil
LEFT JOIN BiologicalForm bf ON s.idBiologicalForm = bf.idBiologicalForm
LEFT JOIN Fruit fr ON s.idFruit = fr.idFruit
LEFT JOIN Flower fl ON s.idFlower = fl.idFlower
LEFT JOIN Abundance ab ON s.idAbundance = ab.idAbundance
LEFT JOIN PlantClassification pc ON s.idPlantClassification = pc.idPlantClassification
WHERE s.protected = 1;
