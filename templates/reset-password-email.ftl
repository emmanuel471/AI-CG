<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
</head>
<body style="font-family: Arial, sans-serif; background-color:#f6f6f6; padding:20px;">

<div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">

    <h2 style="color:#333;">Password Reset Request</h2>

    <p>Hello ${name},</p>

    <p>We received a request to reset your password. Use the code below:</p>

    <div style="text-align:center; margin:25px 0;">
        <p style="font-size:26px; letter-spacing:4px; font-weight:bold; color:#c0392b;">
            ${code}
        </p>
    </div>

    <p>This code will expire in 10 minutes.</p>

    <p>If you did not request this, you can ignore this email.</p>

    <br>
    <p style="font-size:12px; color:#777;">AI Career Guidance System</p>

</div>

</body>
</html>