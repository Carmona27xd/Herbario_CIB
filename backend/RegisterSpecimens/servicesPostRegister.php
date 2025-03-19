<?php
header('Content-Type: application/json'); 
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conexion_path = '../../database/connectionDB.php';
if (file_exists($conexion_path)) {
    include $conexion_path;
} else {
    die(json_encode(['success' => false, 'message' => 'Error: No se encontró connectionDB.php']));
}

$response = [];

//Para checar los datos que le llegan al php
/*file_put_contents('debug_post.txt', print_r($_POST, true));
file_put_contents('debug_files.txt', print_r($_FILES, true));

echo "<pre>";
print_r($_POST);
print_r($_FILES);
echo "</pre>";
exit();*/

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido', 405);
    }

    if (!isset($_POST['scientificName'])) {
        throw new Exception('Datos incompletos', 400);
    }

    $associated = $_POST['associated']; 
    $lifeCycle = $_POST['lifeCycle']; 
    $size = $_POST['size']; 
    $numberDuplicates = $_POST['numberDuplicates']; 
    $otherInformation = $_POST['otherInformation']; 
    $protected = isset($_POST['protected']) && $_POST['protected'] === "true" ? 1 : 0;

    $specimenImageData = isset($_FILES['specimenImage']) && $_FILES['specimenImage']['error'] === 0
        ? file_get_contents($_FILES['specimenImage']['tmp_name'])
        : null; 

    $typeVegetationID = $_POST['typeVegetation']; 
    $soilID = $_POST['soil']; 
    $biologicalFormID = $_POST['biologicalForm']; 
    $fruitID = $_POST['fruit']; 
    $flowerID = $_POST['flower']; 
    $abundanceID = $_POST['abundance']; 
    $plantClassificationID = $_POST['plantClassification']; 

    $determinerName = $_POST['determinerName']; 
    $determinerLastNameP = isset($_POST['determinerLastNameP']) ? $_POST['determinerLastNameP'] : 'Perez'; 
    $determinerLastNameM = isset($_POST['determinerLastNameM']) ? $_POST['determinerLastNameM'] : 'Reata'; 
    $determinationDate = isset($_POST['determinationDate']) ? $_POST['determinationDate'] : date('Y-m-d'); 

    $collectNumber = $_POST['collectNumber']; 
    $localName = $_POST['localName']; 
    $collectDate = $_POST['collectDate']; 
    $microhabitat = isset($_POST['microhabitat']) && $_POST['microhabitat'] !== "undefined" ? $_POST['microhabitat'] : 1;
    $fieldBookImageData = isset($_FILES['fieldBookImage']) && $_FILES['fieldBookImage']['error'] === 0
        ? file_get_contents($_FILES['fieldBookImage']['tmp_name'])
        : null; 

    $collectors = $_POST['collectors']; 

    $stateID = $_POST['state']; 
    $municipalityID = $_POST['municipality']; 
    $localityID = $_POST['locality']; 

    $latitude = $_POST['latitude']; 
    $longitude = $_POST['longitude']; 
    $altitude = $_POST['altitude']; 

    $scientificName = $_POST['scientificName']; 
    $familyID = $_POST['family']; 
    $genreID = $_POST['genre']; 
    $speciesID = $_POST['species']; 

    /*$logFile = 'debug.log'; 
    $logData = print_r(array(
        'associated' => $associated,
        'lifeCycle' => $lifeCycle,
        'size' => $size,
        'numberDuplicates' => $numberDuplicates,
        'otherInformation' => $otherInformation,
        'protected' => $protected,
        'typeVegetationID' => $typeVegetationID,
        'soilID' => $soilID,
        'biologicalFormID' => $biologicalFormID,
        'fruitID' => $fruitID,
        'flowerID' => $flowerID,
        'abundanceID' => $abundanceID,
        'plantClassificationID' => $plantClassificationID,
        'determinerName' => $determinerName,
        'determinerLastNameP' => $determinerLastNameP,
        'determinerLastNameM' => $determinerLastNameM,
        'determinationDate' => $determinationDate,
        'collectNumber' => $collectNumber,
        'localName' => $localName,
        'collectDate' => $collectDate,
        'microhabitat' => $microhabitat,
        'collectors' => $collectors,
        'stateID' => $stateID,
        'municipalityID' => $municipalityID,
        'localityID' => $localityID,
        'latitude' => $latitude,
        'longitude' => $longitude,
        'altitude' => $altitude,
        'scientificName' => $scientificName,
        'familyID' => $familyID,
        'genreID' => $genreID,
        'speciesID' => $speciesID
    ), true);

    // Escribir en el archivo de log
    file_put_contents($logFile, $logData, FILE_APPEND);*/

    $sql = "CALL TP_RegistrarEjemplar(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);

    $stmt->bind_param("sidisibiiiiiiissssissibsiiidddsiii",
        $associated, $lifeCycle, $size, $numberDuplicates, $otherInformation, $protected,
        $specimenImageData, $typeVegetationID, $soilID, $biologicalFormID,
        $fruitID, $flowerID, $abundanceID, $plantClassificationID,
        $determinerName, $determinerLastNameP, $determinerLastNameM, $determinationDate,
        $collectNumber, $localName, $collectDate, $microhabitatID, $fieldBookImageData,
        $collectors, $stateID, $municipalityID, $localityID, $latitude, $longitude, $altitude,
        $scientificName, $familyID, $genreID, $speciesID
    );

    if ($stmt->execute()) {
        $response = ["success" => true, "message" => "Ejemplar registrado correctamente."];
    } else {
        throw new Exception("Error al registrar: " . $stmt->error, 500);
    }

    $stmt->close();
    $conexion->close();
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    $response = [
        "success" => false,
        "error" => $e->getMessage(),
        "trace" => $e->getTrace() 
    ];
}

echo json_encode($response);
exit;
?>