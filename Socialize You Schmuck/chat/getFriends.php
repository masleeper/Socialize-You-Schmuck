<?php
$db=new PDO("mysql:host=localhost;dbname=","","");
$input=file_get_contents("php://input");
$query="SELECT * FROM friends WHERE user_id=$input;";//user id of user
$stmnt=$db->prepare($query);
$stmnt->execute();
$result=$stmnt->fetchAll(PDO::FETCH_ASSOC);
$list=unserialize($result[0]['list']);//array of the user ids of friends
//gets the username of friends
$arr=[];
for($i=0;$i<count($list);$i++){
    $id=$list[$i];
    $query="SELECT * FROM users WHERE user_id=$id;";
    $stmnt=$db->prepare($query);
    $stmnt->execute();
    $result=$stmnt->fetchAll(PDO::FETCH_ASSOC);
    $arr[]=$result[0]['un'];
}
echo json_encode($arr);
?>