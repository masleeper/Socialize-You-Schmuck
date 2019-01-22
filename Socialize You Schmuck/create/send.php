<?php
$input=file_get_contents("php://input");
$data=json_decode($input);
$un=$data->un;
$pw=sha1($data->pw);

$dbh=new PDO("mysql:host=localhost;dbname=","","");
//check to see if username is taken
$query="SELECT * FROM users WHERE un='$un';";
$stmnt=$dbh->prepare($query);
$stmnt->execute();
$result=$stmnt->fetchAll(PDO::FETCH_ASSOC);
$validUn=!$un==$result[0]['un'];

if($validUn){//if username is free
    $getNumUsers="SELECT * FROM users;";
    $stmn=$dbh->prepare($getNumUsers);
    $stmn->execute();
    $res=$stmn->fetchAll(PDO::FETCH_ASSOC);
    $numUsers=count($res)+1;//user's id
    $setquery="INSERT INTO users (un, pw, user_id) VALUES('$un', '$pw', $numUsers);";//insert user into database
    $stmn=$dbh->prepare($setquery);
    $stmn->execute();
    //creat friend list
    $query="INSERT INTO friends(user_id, list) VALUES ($numUsers, NULL);";
    $stmnt=$dbh->prepare($query);
    $stmnt->execute();
}else{
    echo "Username is taken";
}
?>