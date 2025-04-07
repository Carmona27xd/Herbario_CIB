<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
include '../database/connectionDB.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Verificar que los datos están presentes
        if (!isset($_POST['id_collector'], $_POST['name'], $_POST['first_surname'], $_POST['second_surname'], $_POST['ascription'])) {
            echo json_encode(["success" => false, "message" => "Error: datos incompletos"]);
            exit;
        }

        // Obtener los valores enviados desde el formulario
        $id_collector = intval($_POST["id_collector"]);
        $name = trim($_POST["name"]);
        $first_surname = trim($_POST["first_surname"]);
        $second_surname = trim($_POST["second_surname"]);
        $ascription = trim($_POST["ascription"]);

        // Actualizar en la base de datos
        $stmt = $pdo->prepare("UPDATE collector 
                               SET names = :name, first_surname = :first_surname, second_surname = :second_surname, ascription = :ascription 
                               WHERE id_collector = :id_collector");

        $stmt->bindParam(":id_collector", $id_collector, PDO::PARAM_INT);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":first_surname", $first_surname);
        $stmt->bindParam(":second_surname", $second_surname);
        $stmt->bindParam(":ascription", $ascription);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Colector actualizado correctamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al actualizar el colector."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error: Método no permitido"]);
}
?>
