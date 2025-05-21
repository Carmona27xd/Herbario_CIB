<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json'); 

include '../database/connectionDB.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        $names = $_POST["name"];
        $first_surname = $_POST["first_surname"];
        $second_surname = $_POST["second_surname"];
        $email = $_POST["email"];
        $ref_names = $_POST["ref_name"];
        $ref_first_surname = $_POST["ref_first_surname"];
        $ref_second_surname = $_POST["ref_second_surname"];
        $ref_email = $_POST["ref_email"];

        $curriculum_file = file_get_contents($_FILES["cv_file"]["tmp_name"]);
        $curriculum_name = $_FILES["cv_file"]["name"];

        $permit_file = isset($_FILES["permit_file"]["tmp_name"]) ? file_get_contents($_FILES["permit_file"]["tmp_name"]) : null;
        $permit_name = isset($_FILES["permit_file"]["name"]) ? $_FILES["permit_file"]["name"] : null;

        $letter_file = file_get_contents($_FILES["letter_file"]["tmp_name"]);
        $letter_name = $_FILES["letter_file"]["name"];

        $proyect_file = isset($_FILES["proyect_file"]["tmp_name"]) ? file_get_contents($_FILES["proyect_file"]["tmp_name"]) : null;
        $proyect_name = isset($_FILES["proyect_file"]["name"]) ? $_FILES["proyect_file"]["name"] : null;


        $stmt = $pdo->prepare("INSERT INTO collector_requests (`name`, `first_surname`, `second_surname`, `email`, `ref_name`,
        `ref_first_surname`, `ref_second_surname`, `ref_email`, `curriculum`, `curriculum_name`, `permit`, `permit_name`,
        `letter`, `letter_name`, `proyect`, `proyect_name`) 
        VALUES (:name, :first_surname, :second_surname, :email, :ref_name, :ref_first_surname, :ref_second_surname, 
        :ref_email, :curriculum, :curriculum_name, :permit, :permit_name, :letter, :letter_name, :proyect, :proyect_name)");

        $stmt->bindParam(":name", $names);
        $stmt->bindParam(":first_surname", $first_surname);
        $stmt->bindParam(":second_surname", $second_surname);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":ref_name", $ref_names);
        $stmt->bindParam(":ref_first_surname", $ref_first_surname);
        $stmt->bindParam(":ref_second_surname", $ref_second_surname);
        $stmt->bindParam(":ref_email", $ref_email);
        $stmt->bindParam(":curriculum", $curriculum_file, PDO::PARAM_LOB);
        $stmt->bindParam(":curriculum_name", $curriculum_name);
        $stmt->bindParam(":permit", $permit_file, PDO::PARAM_LOB);
        $stmt->bindParam(":permit_name", $permit_name);
        $stmt->bindParam(":letter", $letter_file, PDO::PARAM_LOB);
        $stmt->bindParam(":letter_name", $letter_name);
        $stmt->bindParam(":proyect", $proyect_file, PDO::PARAM_LOB);
        $stmt->bindParam(":proyect_name", $proyect_name);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Enviado"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar la solicitud"]);
        }

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message: " => "Error: metodo no permitido"]);
}
?>