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

file_put_contents('debug.log', print_r($_POST, true), FILE_APPEND);

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido', 405);
    }

    if (!isset($_POST['scientificName'])) {
        throw new Exception('Datos incompletos', 400);
    }

    $ejemplarID = $_POST['ejemplarId'];
    //$associated = $_POST['associated'] ?? "N/A";
    $associated = !empty($_POST['associated']) 
    ? trim($_POST['associated']) 
    : "N/A";
    $lifeCycle = $_POST['lifeCycle']; 
    $size = $_POST['size']; 
    $numberDuplicates = $_POST['numberDuplicates']; 
    //$otherInformation = $_POST['otherInformation'] ?? "N/A";
    $otherInformation = !empty($_POST['otherInformation']) 
    ? trim($_POST['otherInformation']) 
    : "N/A";
    $protected = isset($_POST['protected']) && $_POST['protected'] === "true" ? 1 : 0;
    //$environmentalInformation = $_POST['environmentalInformation'] ?? "N/A";
    $environmentalInformation = !empty($_POST['environmentalInformation']) 
    ? trim($_POST['environmentalInformation']) 
    : "N/A";
    //$typeVegetationID = $_POST['typeVegetation'] ?? null;
    $typeVegetationID = !empty($_POST['typeVegetation']) && trim($_POST['typeVegetation']) !== ''
    ? trim($_POST['typeVegetation'])
    : null; 
    //$soilID = $_POST['soil'] ?? null; 
    $soilID = !empty($_POST['soil']) && trim($_POST['soil']) !== ''
    ? trim($_POST['soil'])
    : null;
    //$biologicalFormID = $_POST['biologicalForm'] ?? null; 
    $biologicalFormID = !empty($_POST['biologicalForm']) && trim($_POST['biologicalForm']) !== ''
    ? trim($_POST['biologicalForm'])
    : null;
    //$fruitID = $_POST['fruit'] ?? null; 
    $fruitID = !empty($_POST['fruit']) && trim($_POST['fruit']) !== ''
    ? trim($_POST['fruit'])
    : null;
    //$flowerID = $_POST['flower'] ?? null; 
    $flowerID = !empty($_POST['flower']) && trim($_POST['flower']) !== ''
    ? trim($_POST['flower'])
    : null;
    $abundanceID = $_POST['abundance']; 
    $plantClassificationID = $_POST['plantClassification']; 

    $determinerName = $_POST['determinerName']; 
    $determinerLastNameP = $_POST['determinerLastName'];
    $determinerLastNameM = $_POST['determinerLastName2'];

    $collectNumber = $_POST['collectNumber']; 
    $localName = $_POST['localName']; 
    $collectDate = $_POST['collectDate']; 
    //$microhabitat = $_POST['microhabitat'] ?? null;
    $microhabitat = !empty($_POST['microhabitat']) && trim($_POST['microhabitat']) !== ''
    ? trim($_POST['microhabitat'])
    : null;
    $collectors = $_POST['collectors']; 

    $stateID = $_POST['state']; 
    $municipalityID = $_POST['municipality']; 
    $localityID = $_POST['locality']; 

    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];
    $altitude = $_POST['altitude'];

    $latitudeDegrees = $_POST['latitudeDegrees']; 
    $latitudeMinutes = $_POST['latitudeMinutes']; 
    $latitudeSeconds = $_POST['latitudeSeconds'];
    $longitudeDegrees = $_POST['longitudeDegrees'];
    $longitudeMinutes = $_POST['longitudeMinutes'];
    $longitudeSeconds = $_POST['longitudeSeconds'];

    $scientificName = $_POST['scientificName']; 
    $familyID = $_POST['family']; 
    //$genreID = $_POST['genre'];
    $microhabitat = !empty($_POST['genreID']) && trim($_POST['genre']) !== ''
    ? trim($_POST['genre'])
    : null; 
    //$speciesID = $_POST['species'];
    $microhabitat = !empty($_POST['speciesID']) && trim($_POST['speciesID']) !== ''
    ? trim($_POST['speciesID'])
    : null;

    $uploadDir = '../../uploads/'; 
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $specimenImagePath = null;
    if (isset($_FILES['specimenImage']) && $_FILES['specimenImage']['error'] === 0) {
        $imageName = time() . '_' . basename($_FILES['specimenImage']['name']); 
        $specimenImagePath = 'uploads/' . $imageName; // Ruta relativa
        move_uploaded_file($_FILES['specimenImage']['tmp_name'], "../../" . $specimenImagePath);
    }

    $fieldBookImagePath = null;
    if (isset($_FILES['fieldBookImage']) && $_FILES['fieldBookImage']['error'] === 0) {
        $imageName = time() . '_' . basename($_FILES['fieldBookImage']['name']); 
        $fieldBookImagePath = 'uploads/' . $imageName;
        move_uploaded_file($_FILES['fieldBookImage']['tmp_name'], "../../" . $fieldBookImagePath);
    }

    $sql = "CALL TP_RegistrarEjemplar(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);

    $stmt->bind_param("ssidisissiiiiiiisssississiiidddiiiiiisiii",
        $ejemplarID, $associated, $lifeCycle, $size, $numberDuplicates, $otherInformation, $protected, $environmentalInformation,
        $specimenImagePath, $typeVegetationID, $soilID, $biologicalFormID,
        $fruitID, $flowerID, $abundanceID, $plantClassificationID,
        $determinerName, $determinerLastNameP, $determinerLastNameM,
        $collectNumber, $localName, $collectDate, $microhabitat, $fieldBookImagePath,
        $collectors, $stateID, $municipalityID, $localityID, $latitude, $longitude, $altitude,
        $latitudeDegrees, $latitudeMinutes, $latitudeSeconds, $longitudeDegrees, $longitudeMinutes, $longitudeSeconds,
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