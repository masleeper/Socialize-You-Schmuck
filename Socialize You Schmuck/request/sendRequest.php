<?php
$dbh=new PDO("mysql:host=localhost;dbname=","","");
$input=file_get_contents("php://input");
$data=json_decode($input);
//data to be entered into table
$from=$data->from;
$to=$data->to;
//entering data into table
$query="INSERT INTO requests (from_user_id, to_user_id) VALUES ($from, $to);";
$stmnt=$dbh->prepare($query);
$stmnt->execute();
$dbh=null;
?>