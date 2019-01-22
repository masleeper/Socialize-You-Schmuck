<?php
$db=new PDO("mysql:host=localhost;dbname=","","");
$input=file_get_contents("php://input");//username of chat partner
//gets user id of chat partner
$query="SELECT * FROM users WHERE un='$input';";
$stmnt=$db->prepare($query);
$stmnt->execute();
$result=$stmnt->fetchAll(PDO::FETCH_ASSOC);
$id=$result[0]['user_id'];
echo $id;
?>