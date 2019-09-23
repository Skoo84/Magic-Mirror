<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

//Creating Array for JSON response
$response = array();
 
// Check if we got the field from the user
if (isset($_GET['loc']) && isset($_GET['temp']) && isset($_GET['hum'])) {
   
    $loc = $_GET['loc'];
    $temp = $_GET['temp'];
    $hum = $_GET['hum'];
 
    // Include data base connect class
    $filepath = realpath (dirname(__FILE__));
	require_once($filepath."/db_connect.php");

    //include_once("db_connect.php");

    // Connecting to database 
    //$con = new DB_CONNECT();
 
    // Fire SQL query to insert data in weather
    $result = mysqli_query($con,"INSERT INTO $loc(temp,hum,measured_on) VALUES('$temp','$hum',(now() + INTERVAL 3 HOUR))");
 
    // Check for succesfull execution of query
    if ($result) {
        // successfully inserted 
        $response["success"] = 1;
        $response["message"] = "Weather in '$loc' successfully created.";
 
        // Show JSON response
        echo json_encode($response);
    } else {
        // Failed to insert data in database
        $response["success"] = 0;
        $response["message"] = "Something has been wrong";
 
        // Show JSON response
        echo json_encode($response);
    }
} else {
    // If required parameter is missing
    $response["success"] = 0;
    $response["message"] = "Parameter(s) are missing. Please check the request";
 
    // Show JSON response
    echo json_encode($response);
}
?>
