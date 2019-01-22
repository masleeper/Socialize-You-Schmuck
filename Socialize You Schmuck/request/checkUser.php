<?php
$dbh=new PDO("mysql:host=localhost;dbname=","","");
$input=file_get_contents("php://input");//gets input sent from javascript
$query="SELECT * FROM users WHERE un='$input';";//query to check if user exists
$stmnt=$dbh->prepare($query);
$stmnt->execute();
$result=$stmnt->fetchAll(PDO::FETCH_ASSOC);
if($result[0]['un']==$input){//if user exists
    echo $result[0]['user_id'];
}else{//if user doesn't exists
    echo 0;
}
?>