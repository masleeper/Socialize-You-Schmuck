<?php
$link=mysqli_connect("localhost","","","");
$input=file_get_contents("php://input");
$data=json_decode($input);
$un=$data->un;
$pw=sha1($data->pw);
//checks login credentials
$queryun=mysqli_query($link, "SELECT * FROM `users` WHERE un='$un';") or die(mysqli_error($link));//for username
$querypw=mysqli_query($link, "SELECT * FROM `users` WHERE pw='$pw';") or die(mysqli_error($link));//for password
$unarr=mysqli_fetch_assoc($queryun);
$pwarr=mysqli_fetch_assoc($querypw);
//true if checks out, false otherwise
if($unarr['un']==$un && $pwarr['pw']==$pw){
    echo "true";
}else{
    echo "false";
}
?>