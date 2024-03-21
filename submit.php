<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $firstName = $_POST["firstName"];
    $lastName = $_POST["lastName"];
    $email = $_POST["email"];
    $telephone = $_POST["telephone"];
    $message = $_POST["message"];
    $termsConditions = isset($_POST["termsConditions"]) ? $_POST["termsConditions"] : '';

    // Save data to JSON file
    $formData = [
        "firstName" => $firstName,
        "lastName" => $lastName,
        "email" => $email,
        "telephone" => $telephone,
        "message" => $message,
        "termsConditions" => $termsConditions
    ];
    $json = json_encode($formData, JSON_PRETTY_PRINT);
    file_put_contents("form_data.json", $json);

    // Send emails
    $adminEmails = ["dumidu.kodithuwakku@ebeyonds.com", "prabhath.senadheera@ebeyonds.com"];
    $subject = "New Form Submission";
    $adminMessage = "A new form submission:\n" . json_encode($formData, JSON_PRETTY_PRINT);
    foreach ($adminEmails as $adminEmail) {
        mail($adminEmail, $subject, $adminMessage);
    }

    // Send auto response email
    $autoResponseSubject = "Thank you for contacting us!";
    $autoResponseMessage = "Thank you for contacting us! We will get back to you as soon as possible.";
    mail($email, $autoResponseSubject, $autoResponseMessage);

    // Show thank you message
    echo '<script>document.getElementById("thank-you-message").textContent = "Thank you for your submission!"; document.getElementById("thank-you-message").setAttribute("aria-live", "polite");</script>';
}
?>