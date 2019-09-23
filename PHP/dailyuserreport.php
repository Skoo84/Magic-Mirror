<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");


//Creating Array for JSON response
$response = array();
 
// Include data base connect class
require('connectDB.php');

if (isset($_GET['day']) ) {
    $day = $_GET['day'];}

 // Fire SQL query to get all data from users
$result = mysqli_query($conn,"SELECT Name, UserStat FROM logs WHERE DateLog = '$day' ") or die(mysqli_error($conn));
 
// Check for succesful execution of query and no results found
if (mysqli_num_rows($result) > 0) {
    
	// Storing the returned array in response
    $response["users"] = array();
 
	// While loop to store all the returned response in variable
    while ($row = mysqli_fetch_array($result)) {
        // temporary user array
        $user = array();
        $user["Name"] = $row["Name"];
        $user["UserStat"] = $row["UserStat"];
        

		// Push all the items 
        array_push($response["users"], $user);
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
    $response["message"] = "No data on this day found";
 
    // Show JSON response
    echo json_encode($response);
}

?>
