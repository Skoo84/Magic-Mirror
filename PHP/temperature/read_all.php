<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");


//Creating Array for JSON response
$response = array();
 
// Include data base connect class
$filepath = realpath (dirname(__FILE__));
require_once($filepath."/db_connect.php");
if (isset($_GET['loc'])) {
   
    $loc = $_GET['loc'];
}
 
 // Fire SQL query to get all data from weather
$result = mysqli_query($con,"SELECT *FROM $loc") or die(mysqli_error($con));
 
// Check for succesfull execution of query and no results found
if (mysqli_num_rows($result) > 0) {
    
	// Storing the returned array in response
    $response["location"] = array();
 
	// While loop to store all the returned response in variable
    while ($row = mysqli_fetch_array($result)) {
        // temporary user array
        $location = array();
        $location["id"] = $row["id"];
        $location["temp"] = $row["temp"];
        $location["hum"] = $row["hum"];
        $location["measured_on"] = $row["measured_on"];

		// Push all the items 
        array_push($response["location"], $location);
    }
    // On success
    //$response["success"] = 1;
 
    // Show JSON response
    echo json_encode($response);
}	
else 
{
    // If no data is found
	$response["success"] = 0;
    $response["message"] = "No data on warehouse found";
 
    // Show JSON response
    echo json_encode($response);
}

?>
