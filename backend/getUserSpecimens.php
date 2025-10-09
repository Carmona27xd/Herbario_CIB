<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include '../database/connectionDB.php';

if (!isset($_GET['email']) || empty($_GET['email'])) {
    echo json_encode(["success" => false, "message" => "Correo del colector no proporcionado."]);
    exit;
}

$collectorEmail = $_GET['email'];

try {
    // Consulta SQL actualizada para incluir todas las columnas de `Specimen`
    $sql = "
        SELECT
            s.*,
            vt.name AS vegetationTypeName,
            so.name AS soilName,
            bf.name AS biologicalFormName,
            f.name AS fruitName,
            fl.name AS flowerName,
            a.name AS abundanceName,
            pc.name AS plantClassificationName
        FROM
            Specimen s
        LEFT JOIN
            VegetationType vt ON s.idVegetationType = vt.idVegetationType
        LEFT JOIN
            Soil so ON s.idSoil = so.idSoil
        LEFT JOIN
            BiologicalForm bf ON s.idBiologicalForm = bf.idBiologicalForm
        LEFT JOIN
            Fruit f ON s.idFruit = f.idFruit
        LEFT JOIN
            Flower fl ON s.idFlower = fl.idFlower
        LEFT JOIN
            Abundance a ON s.idAbundance = a.idAbundance
        LEFT JOIN
            PlantClassification pc ON s.idPlantClassification = pc.idPlantClassification
        WHERE
            s.collector_email = :email
        ORDER BY
            s.idSpecimen DESC;
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $collectorEmail, PDO::PARAM_STR);
    $stmt->execute();
    $specimens = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "data" => $specimens]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error de base de datos: " . $e->getMessage()]);
}
?>