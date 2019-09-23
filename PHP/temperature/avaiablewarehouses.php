<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$filepath = realpath (dirname(__FILE__));
require_once($filepath."/db_connect.php");

$sql = "SELECT table_name FROM information_schema.tables where (table_schema='nodemcuweather' and table_type != 'VIEW' and table_name != 'time_passed')";
$result = mysqli_query($con, $sql);

	
 /// Check for succesfull execution of query and no results found
if (mysqli_num_rows($result) > 0) {
    
	// Storing the returned array in response
    $response["latest"] = array();
 
	// While loop to store all the returned response in variable
    while ($row = mysqli_fetch_array($result)) {
        // temporary user array
        $latest = array();
        $latest["TABLE_NAME"] = $row["TABLE_NAME"];
    

		// Push all the items 
        array_push($response["latest"], $latest);
    }
    // On success
    $response["success"] = 1;
 
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
