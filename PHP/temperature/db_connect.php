<?php

require_once($filepath."/dbconfig.php");
$con = mysqli_connect( DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE) or die(mysqli_connect_error());
mysqli_query($con,"SET NAMES UTF8");
 ?>

 
