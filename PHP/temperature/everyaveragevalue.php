<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
$filepath = realpath (dirname(__FILE__));
require_once($filepath."/db_connect.php");
if (isset($_GET['timeframe'])) {
	$timeframe = $_GET['timeframe'];
}
//there are views measuring the averages
$sql = "SELECT table_name FROM information_schema.tables where (table_schema='nodemcuweather' and table_type != 'VIEW' and table_name != 'time_passed')";
$result = mysqli_query($con, $sql);
$numofrows = mysqli_num_rows($result);

  $sqlQuery = '';
  $i=0;
  while($d = mysqli_fetch_array($result)){
      $i++;

      if($i==$numofrows){
        $sqlQuery .= "SELECT CAST(AVG(temp) AS DECIMAL(10,1)) AS average, MIN(temp) as lowest, MAX(temp) as highest, '".$d[0]."' as sensor
        FROM (SELECT temp FROM ".$d[0]." ORDER BY measured_on DESC LIMIT $timeframe) temp" ;
      }else{
        $sqlQuery .= "SELECT CAST(AVG(temp) AS DECIMAL(10,1)) AS average, MIN(temp) as lowest, MAX(temp) as highest, '".$d[0]."' as sensor
        FROM (SELECT temp FROM ".$d[0]." ORDER BY measured_on DESC LIMIT $timeframe) temp UNION ALL " ;
      }
  }

 //echo $sqlQuery; //your Sql Query

 // Fire SQL query to get weather data by id
 $result = mysqli_query($con,$sqlQuery);
	
 /// Check for succesfull execution of query and no results found
if (mysqli_num_rows($result) > 0) {
    
	// Storing the returned array in response
    $response["latest"] = array();
 
	// While loop to store all the returned response in variable
    while ($row = mysqli_fetch_array($result)) {
        // temporary user array
        $latest = array();
        $latest["average"] = $row["average"];
        $latest["lowest"] = $row["lowest"];
        $latest["highest"] = $row["highest"];
        $latest["sensor"] = $row["sensor"];

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
