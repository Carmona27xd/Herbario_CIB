<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../database/connectionDB.php'; // Ruta correcta

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificar si los datos llegaron
    if (!isset($_POST["user"]) || !isset($_POST["password"])) {
        die("Error: Datos incompletos.");
    }

    $user = trim($_POST["user"]);
    $password = password_hash(trim($_POST["password"]), PASSWORD_BCRYPT); // Cifrar contraseña

    // Insertar en la base de datos
    $stmt = $conexion->prepare("INSERT INTO users (`user`, `password`) VALUES (?, ?)");
    if (!$stmt) {
        die("Error al preparar la consulta: " . $conexion->error);
    }

    $stmt->bind_param("ss", $user, $password);

    if ($stmt->execute()) {
        echo "Registro exitoso";
    } else {
        echo "Error al registrar: " . $stmt->error;
    }

    $stmt->close();
    $conexion->close();
} else {
    echo "Método no permitido";
}
?>
