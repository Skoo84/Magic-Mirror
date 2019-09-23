<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

//Creating Array for JSON response
$response = array();
 
// Include data base connect class
$filepath = realpath (dirname(__FILE__));
require_once($filepath."/db_connect.php");

 // Connecting to database
//$db = new DB_CONNECT();
 
// Check if we got the field from the user
if (isset($_GET['loc']) && isset($_GET["timeframe"])) {
    $timeframe = $_GET['timeframe'];
    $loc = $_GET['loc'];

     // Fire SQL query to get weather data by id
    $result = mysqli_query($con, "SELECT CAST(AVG(temp) AS DECIMAL(10,1)) AS average, MIN(temp) as lowest, MAX(temp) as highest, '$loc' as sensor
    FROM (SELECT temp FROM $loc ORDER BY measured_on DESC LIMIT $timeframe) temp");

	//If returned result is not empty
    if (!empty($result)) {

        // Check for succesfull execution of query and no results found
        if (mysqli_num_rows($result) > 0) {
			
			// Storing the returned array in response
            $result = mysqli_fetch_array($result);
			
			// temperoary user array
            $warehouse = array();
            $warehouse["average"] = $result["average"];
            $warehouse["lowest"] = $result["lowest"];
            $warehouse["highest"] = $result["highest"];
            $warehouse["sensor"] = $result["sensor"];
          
            $response["success"] = 1;

            $response["warehouse"] = array();
			
			// Push all the items 
            array_push($response["warehouse"], $warehouse);
 
            // Show JSON response
            echo json_encode($response);
        } else {
            // If no data is found
            $response["success"] = 0;
            $response["message"] = "No data on warehouse found";
 
            // Show JSON response
            echo json_encode($response);
        }
    } else {
        // If no data is found
        $response["success"] = 0;
        $response["message"] = "No data on warehouse found";
 
        // Show JSON response
        echo json_encode($response);
    }
} else {
    // If required parameter is missing
    $response["success"] = 0;
    $response["message"] = "Parameter(s) are missing. Please check the request";
 
    // echoing JSON response
    echo json_encode($response);
}
?>