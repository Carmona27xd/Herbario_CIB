<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json'); 

include '../database/connectionDB.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Verificar que todos los datos estén presentes
        if (!isset($_POST['name'], $_POST['first_surname'], $_POST['second_surname'], $_POST['ascription'], $_POST['email'])) {
            echo json_encode(["success" => false, "message" => "Error: datos incompletos"]);
            exit;
        }

        // Obtener los valores del formulario
        $name = trim($_POST["name"]);
        $first_surname = trim($_POST["first_surname"]);
        $second_surname = trim($_POST["second_surname"]);
        $ascription = trim($_POST["ascription"]);
        $email = trim($_POST["email"]);

        // Insertar en la base de datos (sin pdf)
        $stmt = $pdo->prepare("INSERT INTO collector (`names`, `first_surname`, `second_surname`, `ascription`, `email`) 
                               VALUES (:name, :first_surname, :second_surname, :ascription, :email)");

        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":first_surname", $first_surname);
        $stmt->bindParam(":second_surname", $second_surname);
        $stmt->bindParam(":ascription", $ascription);
        $stmt->bindParam(":email", $email);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Colector registrado exitosamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error en el registro"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error: Método no permitido"]);
}
?>
