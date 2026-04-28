<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['fullName'] ?? '';
    $email = $_POST['email'] ?? '';
    $attendance = $_POST['attendance'] ?? '';
    $message = $_POST['message'] ?? '';

    $file = "rsvp_data.txt";

    $entry = "Name: $name\nEmail: $email\nAttendance: $attendance\nMessage: $message\n-------------------\n";

    file_put_contents($file, $entry, FILE_APPEND);

    echo "success";
}
?>