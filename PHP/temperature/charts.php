<?php
	
	
	// Include data base connect class
	$filepath = realpath (dirname(__FILE__));
	require_once($filepath."/db_connect.php");
if (isset($_GET['loc']) && isset($_GET['timeframe'])) {
   
	$loc = $_GET['loc'];
	$timeframe = $_GET['timeframe'];
}
	$query = "SELECT temp, hum,
	UNIX_TIMESTAMP(CONCAT_WS(\" \", CONVERT_TZ(measured_on,'+03:00','+00:00'))) AS datetime 
	FROM $loc
	ORDER BY measured_on DESC
	LIMIT $timeframe";
	$result = mysqli_query($con, $query);
	$rows = array();
	$table = array();
	
	$table['cols'] = array(
	 array(
	  'label' => 'Date Time', 
	  'type' => 'datetime'
	 ),
	 array(
	  'label' => 'Temperature (°C)', 
	  'type' => 'number'
	 ),
	 array(
		'label' => 'Relative humidity)', 
		'type' => 'number'
	   ),
	);
	
	while($row = mysqli_fetch_array($result))
	{
	 $sub_array = array();
	 $datetime = explode(".", $row["datetime"]);
	 $sub_array[] =  array(
		  "v" => 'Date(' . $datetime[0] . '000)'
		 );
	 $sub_array[] =  array(
		  "v" => $row["temp"]
		 );
		 $sub_array[] =  array(
			"v" => $row["hum"]
			
		   );
	 $rows[] =  array(
		 "c" => $sub_array
		);
	}
	$table['rows'] = $rows;
	$jsonTable = json_encode($table);
	
	?>
	
	
	<html>
	 <head>
	  <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
	  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.min.js"></script>
	  <script type="text/javascript">
	   google.charts.load('current', {'packages':['corechart']});
	   google.charts.setOnLoadCallback(drawChart);
	   function drawChart()
	   {
		var data = new google.visualization.DataTable(<?php echo $jsonTable; ?>);
	
		var options = {
		 title:'Sensors Data',
		 legend:{position:'bottom'},
		 chartArea:{width:'95%', height:'65%'},
		 animation: {
			duration: 1000,
      startup: true
      }
		};
	
		var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
	
		chart.draw(data, options);
	   }
	  </script>
	  <style>
	  .page-wrapper
	  {
	   width:1000px;
	   margin:0 auto;
	  }
	  </style>
	 </head>  
	 <body>
	  <div class="page-wrapper">
	   <br/>

	   <h2 align="center"><?php echo "Temperature and Humidity for $loc"?></h2>
	   <div id="line_chart" style="width: 100%; height: 500px">"</div>
	  </div>
	 </body>
	</html>