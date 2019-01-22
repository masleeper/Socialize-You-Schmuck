<?php
$db=new PDO("mysql:host=localhost;dbname=","","");
$input=file_get_contents("php://input");
$data=json_decode($input);
$fromName=$data->from;
$fromId=0;
$to=$data->to;
$ack=$data->ack;

//gets user that responded to request
$query="SELECT *FROM users WHERE un='$fromName';";
$stmnt=$db->prepare($query);
$stmnt->execute();
$result=$stmnt->fetchAll(PDO::FETCH_ASSOC);
$fromId=$result[0]['user_id'];
//deletes request from server
$query="DELETE FROM requests WHERE from_user_id=$fromId AND to_user_id=$to;";
$stmnt=$db->prepare($query);
$stmnt->execute();

if($ack=='accept'){ //if user accepts request
    //update user list of friends
    $query="SELECT * FROM friends WHERE user_id=$to;";
    $qstmnt=$db->prepare($query);
    $qstmnt->execute();
    $result=$qstmnt->fetchAll(PDO::FETCH_ASSOC);
    $list=$result[0]['list'];
    if($list==null){
        $list=[$fromId];
    }else{
        $list=unserialize($list);
        $add=true;
        for($i=0;$i<count($list);$i++){
            if($list[i]==$fromId){
                $add=false;
            }
        }
        if($add){$list[]=$fromId;}
    }
    $list=serialize($list);
    $uquery="UPDATE friends SET list='$list' WHERE user_id=$to;";
    $ustmnt=$db->prepare($uquery);
    $ustmnt->execute();
    //update sender's list of friends
    $query="SELECT * FROM friends WHERE user_id=$fromId;";
    $qstmnt=$db->prepare($query);
    $qstmnt->execute();
    $result=$qstmnt->fetchAll(PDO::FETCH_ASSOC);
    $list=$result[0]['list'];
    if($list==null){
        $list=[$to];
    }else{
        $list=unserialize($list);
        $add=true;
        for($i=0;$i<count($list);$i++){
            if($list[i]==$to){
                $add=false;
            }
        }
        if($add){$list[]=$to;}
    }
    $list=serialize($list);
    $uquery="UPDATE friends SET list='$list' WHERE user_id=$fromId;";
    $ustmnt=$db->prepare($uquery);
    $ustmnt->execute();
    
}
?>