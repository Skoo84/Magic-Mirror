<?php
 
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");

//Creating Array for JSON response
$response = array();
 
// Check if we got the field from the user
if (isset($_GET['loc']) && isset($_GET['id'])) {
  
    $loc = $_GET['loc'];
    $id = $_GET['id'];
 
 
    // Connecting to database 
    $filepath = realpath (dirname(__FILE__));
	require_once($filepath."/db_connect.php");
 
    // Fire SQL query to delete weather data by id
    $result = mysqli_query($con,"DELETE FROM $loc WHERE id = $id");
 
    // Check for succesfull execution of query
    if ($mysqli->affected_rows > 0) {
        // successfully deleted
        $response["success"] = 1;
        $response["message"] = "Data from $loc successfully deleted";
 
        // Show JSON response
        echo json_encode($response);
    } else {
        // no matched id found
        $response["success"] = 0;
        $response["message"] = "No weather data found by given id";
 
        // Echo the failed response
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