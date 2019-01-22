<?php 
$db=new PDO("mysql:host=localhost;dbname=","","");
$input=file_get_contents("php://input");
//fetches all result of specified user
$query="SELECT * FROM requests WHERE to_user_id=$input;";
$stmnt=$db->prepare($query);
$stmnt->execute();
$result=$stmnt->fetchAll(PDO::FETCH_ASSOC);
//adds requests into array to be echoed out
$arr=[];
for($i=0;$i<count($result);$i++){
    $from=$result[$i]['from_user_id'];
    $fquery="SELECT * FROM users WHERE user_id='$from';";
    $fstmnt=$db->prepare($fquery);
    $fstmnt->execute();
    $fresult=$fstmnt->fetchAll(PDO::FETCH_ASSOC);
    // var_dump($fresult);
    $arr[]=$fresult[0]['un'];
}
$json=json_encode($arr);
echo $json;
?>