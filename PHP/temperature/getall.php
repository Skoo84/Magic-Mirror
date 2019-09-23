
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

$sqlQuery = "SELECT student_id,student_name,marks FROM tbl_marks ORDER BY student_id";


$data = array();
foreach ($result as $row) {
	$data[] = $row;
}

mysqli_close($con);

echo json_encode($data);
?>