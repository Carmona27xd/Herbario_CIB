<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json'); 

include '../database/connectionDB.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {  
    $inputData = json_decode(file_get_contents("php://input"), true);

    if (!isset($inputData["name"], $inputData["first_surname"], $inputData["second_surname"], 
               $inputData["email"], $inputData["password"])) {
        echo json_encode(["success" => false, "message" => "Error: Datos incompletos."]);
        exit;
    }

    $name = trim($inputData["name"]);
    $first_Surname = trim($inputData["first_surname"]);
    $second_Surname = trim($inputData["second_surname"]);
    $email = trim($inputData["email"]);
    $password = password_hash(trim($inputData["password"]), PASSWORD_BCRYPT);
    $role_id = 1;

    try {
        $stmt = $pdo->prepare("INSERT INTO users (`name`, `first_surname`, `second_surname`, `email`, `password`, `role_id`) 
                               VALUES (:name, :first_surname, :second_surname, :email, :password, :role_id)");

        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":first_surname", $first_Surname);
        $stmt->bindParam(":second_surname", $second_Surname);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $password);
        $stmt->bindParam(":role_id", $role_id, PDO::PARAM_INT);

        if($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Registro exitoso"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error en el registro"]);
        }
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(["sucess" => false, "message" => "El correo ya se encuentra registrado"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}
?>
