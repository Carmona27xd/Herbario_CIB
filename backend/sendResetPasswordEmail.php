<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php'; 

function sendResetPasswordEmail($toEmail, $resetLink) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; 
        $mail->SMTPAuth = true;
        $mail->Username = 'lecape27@gmail.com'; 
        $mail->Password = 'qbpq ilmf vorb srcs'; 
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('lecape27@gmail.com', 'Herbario CIB');
        $mail->addAddress($toEmail);


        $mail->isHTML(true);
        $mail->Subject = "Cambia tu contrasena";
        $mail->Body = "
            Solicitud de cambio de contrasena,<br><br>
            Haz clic en el siguiente enlace para cambiar tu contrasena:<br>
            <a href='$resetLink'>$resetLink</a><br><br>
            Si no solicitaste este registro, puedes ignorar este mensaje, el enlace expira en 1 hora.
        ";

        $mail->send();
        return true;

    } catch (Exception $e) {
        error_log("Error al enviar correo: {$mail->ErrorInfo}");
        return false;
    }
}
?>