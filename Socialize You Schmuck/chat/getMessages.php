<?php
//connect to server using PHP data object. set to null to close connection
$dbh=new PDO("mysql:host=localhost;dbname=","","");
//create and send query
$query='SELECT * FROM message';
$stmnt=$dbh->prepare($query);
$stmnt->execute();
//turn into associative array
$result=$stmnt->fetchAll(PDO::FETCH_ASSOC);
//turn into json
$json=json_encode($result);
//return the json
echo $json;
//close connection
$dbh=null; 
?>