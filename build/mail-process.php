<?php

extract($_POST);
$emailval = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/';
$mob = "/^[1-9][0-9]*$/";
$response_array['status'] = 'error';

if($name == "" || $email == "" || $message == "") {
    $response_array['status'] = 'error';
}
elseif(!preg_match($emailval, $email)) {
    $response_array['status'] = 'error';
}
elseif($phone != '') {
    if(!preg_match($mob, $phone)) {
        $response_array['status'] = 'error';
    }
}
else {
    $to = 'hadi@alphaweblab.com';
    $subject = "Award Trust Mailer";
    $message = '
    <div align="center">
        <img src="http://pasumkudilawardtrust.org/images/logo-award.png" style="margin: 20px;">
        <table cellpadding="10" cellspacing="0" width="400" style="font-family: \'Helvetica\', \'Arial\', sans-serif; border-collapse: collapse;">
            <thead>
                <tr>
                    <th colspan="2" style="background-color: #39b324; color: #fff; border: 1px solid #39b324;">Response Mail</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #39b324;"><strong>Name</strong></td>
                    <td style="border: 1px solid #39b324;">'.$_POST["name"].'</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #39b324;"><strong>Email</strong></td>
                    <td style="border: 1px solid #39b324;">'.$_POST["email"].'</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #39b324;"><strong>Phone</strong></td>
                    <td style="border: 1px solid #39b324;">'.$_POST["phone"].'</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #39b324;"><strong>Message</strong></td>
                    <td style="border: 1px solid #39b324;">'.$_POST["message"].'</td>
                </tr>
            </tbody>
        </table>
        <p style="font-family: \'Helvetica, \'Arial\', sans-serif;">Response mail from Award Trust website.</p>
    </div>
    ';

    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= 'From: Award Trust Mailer <contact@alphaweblab.com>' . "\r\n";

    if (mail($to, $subject, $message, $headers)) {
        $response_array['status'] = 'success';
    } else {
        $response_array['status'] = 'error';
    }
}

header('Content-type: application/json');
echo json_encode($response_array);

?>
