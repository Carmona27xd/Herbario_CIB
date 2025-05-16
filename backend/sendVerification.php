<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php'; // Ajusta la ruta si es necesario

function sendVerificationEmail($toEmail, $toName, $verificationLink) {
    $mail = new PHPMailer(true);

    try {
        // Server SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; 
        $mail->SMTPAuth = true;
        $mail->Username = 'lecape27@gmail.com'; 
        $mail->Password = 'qbpq ilmf vorb srcs'; 
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('lecape27@gmail.com', 'Herbario CIB');
        $mail->addAddress($toEmail, $toName);

        $mail->isHTML(true);
        $mail->Subject = 'Verifica tu correo';
        $mail->Body = "
            Hola $toName,<br><br>
            Haz clic en el siguiente enlace para verificar tu cuenta:<br>
            <a href='$verificationLink'>$verificationLink</a><br><br>
            Si no solicitaste este registro, puedes ignorar este mensaje.
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Error al enviar correo: {$mail->ErrorInfo}");
        return false;
    }
}
?>
