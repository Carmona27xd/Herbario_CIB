<?php
header('Content-Type: application/json'); 
error_reporting(E_ALL);
ini_set('display_errors', 1);

require '../../vendor/autoload.php';

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

    // Datos del ejemplar
    $ejemplarID = $_POST['ejemplarId'];
    $associated = !empty($_POST['associated']) ? trim($_POST['associated']) : "N/A";
    $lifeCycle = $_POST['lifeCycle']; 
    $size = $_POST['size']; 
    $numberDuplicates = $_POST['numberDuplicates']; 
    $otherInformation = !empty($_POST['otherInformation']) ? trim($_POST['otherInformation']) : "N/A";
    $protected = isset($_POST['protected']) && $_POST['protected'] === "true" ? 1 : 0;
    $environmentalInformation = !empty($_POST['environmentalInformation']) ? trim($_POST['environmentalInformation']) : "N/A";
    $typeVegetationID = !empty($_POST['typeVegetation']) ? trim($_POST['typeVegetation']) : null; 
    $soilID = !empty($_POST['soil']) ? trim($_POST['soil']) : null;
    $biologicalFormID = !empty($_POST['biologicalForm']) ? trim($_POST['biologicalForm']) : null;
    $fruitID = !empty($_POST['fruit']) ? trim($_POST['fruit']) : null;
    $flowerID = !empty($_POST['flower']) ? trim($_POST['flower']) : null;
    $abundanceID = $_POST['abundance']; 
    $plantClassificationID = $_POST['plantClassification']; 
    // Datos del determinador
    $determinerName = $_POST['determinerName']; 
    $determinerLastNameP = $_POST['determinerLastName'];
    $determinerLastNameM = $_POST['determinerLastName2'];
    // Datos de la colecta
    $collectNumber = $_POST['collectNumber']; 
    $localName = $_POST['localName']; 
    $collectDate = $_POST['collectDate']; 
    $microhabitat = !empty($_POST['microhabitat']) ? trim($_POST['microhabitat']) : null;
    $collectors = $_POST['collectors']; 
    // Datos de la direccion de la colecta 
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
    // Datos de el nombre cientifico
    $scientificName = $_POST['scientificName']; 
    $familyID = $_POST['family']; 
    $genreID = !empty($_POST['genreID']) ? trim($_POST['genreID']) : null; 
    $speciesID = !empty($_POST['speciesID']) ? trim($_POST['speciesID']) : null;

    //DATOS PARA MIS CU
    $validated = $_POST['validated'];
    $email = $_POST['email'];

    // Manejo de imágenes
    $uploadDir = '../../uploads/'; 
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $specimenImagePath = null;
    if (isset($_FILES['specimenImage']) && $_FILES['specimenImage']['error'] === 0) {
        $imageName = time() . '_' . basename($_FILES['specimenImage']['name']); 
        $specimenImagePath = 'uploads/' . $imageName; 
        move_uploaded_file($_FILES['specimenImage']['tmp_name'], "../../" . $specimenImagePath);
    }

    $fieldBookImagePath = null;
    if (isset($_FILES['fieldBookImage']) && $_FILES['fieldBookImage']['error'] === 0) {
        $imageName = time() . '_' . basename($_FILES['fieldBookImage']['name']); 
        $fieldBookImagePath = 'uploads/' . $imageName;
        move_uploaded_file($_FILES['fieldBookImage']['tmp_name'], "../../" . $fieldBookImagePath);
    }

    // Llamada al procedimiento almacenado en la bd
    $sql = "CALL TP_RegistrarEjemplar(
        :ejemplarID, :associated, :lifeCycle, :size, :numberDuplicates, :otherInformation, :protected, :environmentalInformation,
        :specimenImagePath, :typeVegetationID, :soilID, :biologicalFormID, :fruitID, :flowerID, :abundanceID, :plantClassificationID,
        :determinerName, :determinerLastNameP, :determinerLastNameM, :collectNumber, :localName, :collectDate, :microhabitat, :fieldBookImagePath,
        :collectors, :stateID, :municipalityID, :localityID, :latitude, :longitude, :altitude,
        :latitudeDegrees, :latitudeMinutes, :latitudeSeconds, :longitudeDegrees, :longitudeMinutes, :longitudeSeconds,
        :scientificName, :familyID, :genreID, :speciesID, :validated, :email
    )";

    $stmt = $pdo->prepare($sql);

    // Bind de parámetros
    $stmt->execute([
        ':ejemplarID' => $ejemplarID,
        ':associated' => $associated,
        ':lifeCycle' => $lifeCycle,
        ':size' => $size,
        ':numberDuplicates' => $numberDuplicates,
        ':otherInformation' => $otherInformation,
        ':protected' => $protected,
        ':environmentalInformation' => $environmentalInformation,
        ':specimenImagePath' => $specimenImagePath,
        ':typeVegetationID' => $typeVegetationID,
        ':soilID' => $soilID,
        ':biologicalFormID' => $biologicalFormID,
        ':fruitID' => $fruitID,
        ':flowerID' => $flowerID,
        ':abundanceID' => $abundanceID,
        ':plantClassificationID' => $plantClassificationID,
        ':determinerName' => $determinerName,
        ':determinerLastNameP' => $determinerLastNameP,
        ':determinerLastNameM' => $determinerLastNameM,
        ':collectNumber' => $collectNumber,
        ':localName' => $localName,
        ':collectDate' => $collectDate,
        ':microhabitat' => $microhabitat,
        ':fieldBookImagePath' => $fieldBookImagePath,
        ':collectors' => $collectors,
        ':stateID' => $stateID,
        ':municipalityID' => $municipalityID,
        ':localityID' => $localityID,
        ':latitude' => $latitude,
        ':longitude' => $longitude,
        ':altitude' => $altitude,
        ':latitudeDegrees' => $latitudeDegrees,
        ':latitudeMinutes' => $latitudeMinutes,
        ':latitudeSeconds' => $latitudeSeconds,
        ':longitudeDegrees' => $longitudeDegrees,
        ':longitudeMinutes' => $longitudeMinutes,
        ':longitudeSeconds' => $longitudeSeconds,
        ':scientificName' => $scientificName,
        ':familyID' => $familyID,
        ':genreID' => $genreID,
        ':speciesID' => $speciesID,

        ////////////////////////

        ':validated' => $validated,
        ':email' => $email

    ]);

    $response = ["success" => true, "message" => "Ejemplar registrado correctamente."];

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    $response = ["success" => false, "error" => $e->getMessage()];
}

echo json_encode($response);
exit;
?>