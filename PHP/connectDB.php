<?php
/* Database connection settings */
	$servername = "****.*****.eu-central-1.rds.amazonaws.com";
    $username = "*****";		//put your phpmyadmin username.(default is "root")
    $password = "*******";			//if your phpmyadmin has a password put it here.(default is "root")
    $dbname = "nodemculog";
    
	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
        die("Database Connection failed: " . $conn->connect_error);
    }
?>