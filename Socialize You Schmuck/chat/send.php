<?php
$link=mysqli_connect("localhost","","","");
$input=file_get_contents("php://input");
$data=json_decode($input);
$to=$data->touser;//receiver of message
$from=$data->fromuser;//sender of message
$text=mysqli_real_escape_string($link, $data->text);//message text, escaped so that mysql can store all possible text
//sends message
$query="INSERT INTO message(date_sent, text, from_user_id, to_user_id) VALUES (NOW(), '$text', $from, $to);";
mysqli_query($link, $query);
mysqli_close($link);
?>