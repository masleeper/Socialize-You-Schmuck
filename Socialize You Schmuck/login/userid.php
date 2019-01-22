<?php
$dbh=new PDO("mysql:host=localhost;dbname=","","");
$input=file_get_contents("php://input");//username of user logging in
//gets the user id of the user logging in
$query="SELECT * FROM users WHERE un='$input';";
$stmnt=$dbh->prepare($query);
$stmnt->execute();
$result=$stmnt->fetchAll(PDO::FETCH_ASSOC);
$userid=$result[0]["user_id"];
echo $userid;
$dbh=null;
?>