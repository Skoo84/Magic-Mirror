<?php
    //Connect to database
    require('connectDB.php');
//**********************************************************************************************
    //Get current date and time
    date_default_timezone_set('Europe/Bucharest');
    $d = date("Y-m-d");
    $t = date("H:i:s");
//**********************************************************************************************
    $Tarrive = mktime(8,0,0);
    $TimeArrive = date("H:i:s", $Tarrive);
//**********************************************************************************************   
    $Tleft = mktime(16,15,0);
    $Timeleft = date("H:i:s", $Tleft);
//**********************************************************************************************
    
if(!empty($_GET['CardID']))
    {
       $Card = $_GET['CardID'];
       $sql = "SELECT * FROM users WHERE CardID='$Card'";
       $result = mysqli_query($conn,$sql);
       
       if (mysqli_num_rows($result) > 0 )
        { 
            $row = mysqli_fetch_assoc($result);

            if (!empty($row['username']) && !empty($row['SerialNumber'])) 
                {
                    
                $sqll = "SELECT * FROM logs WHERE CardNumber='$Card' AND DateLog=LEFT(DATE_ADD(NOW(),INTERVAL 3 hour), 10)";
                $resultl = mysqli_query($conn,$sqll);

                $rowl = mysqli_fetch_assoc($resultl);

                if ( mysqli_num_rows($resultl) > 0 )
                    {   
                        if ($t >= $Timeleft && $rowl['TimeIn'] <= $TimeArrive) 
                                {
                                $UserStat = "Arrived and Left on time";
								$TimeDifference = $Timeleft - $TimeArrive;
                                }
                        elseif ($t < $Timeleft && $rowl['TimeIn'] > $TimeArrive)
                                {   
                                $UserStat = "Arrived late and Left early";
								$TimeDifference = $Timeleft - $TimeArrive;
                                }
                        elseif ($t < $Timeleft && $rowl['TimeIn'] <= $TimeArrive) 
                                {
                                $UserStat = "Arrived on time and Left early";
								$TimeDifference = $Timeleft - $TimeArrive;
                                }
                        elseif ($t >= $Timeleft && $rowl['TimeIn'] > $TimeArrive) 
                                {
                                $UserStat = "Arrived late and Left on time";
								$TimeDifference = $Timeleft - $TimeArrive;
                                }

                        $sqlll="UPDATE logs SET TimeOut=DATE_ADD(CURTIME(),INTERVAL 3 hour), UserStat ='$UserStat' WHERE CardNumber='$Card' AND DateLog=LEFT(DATE_ADD(NOW(),INTERVAL 3 hour), 10)";
                        if ($conn->query($sqlll) === true)
                            {
                                $sqllll="UPDATE logs SET WorkedToday=TIMEDIFF(TimeOut, TimeIn) WHERE CardNumber='$Card' AND DateLog=LEFT(DATE_ADD(NOW(),INTERVAL 3 hour), 10)";
                                if ($conn->query($sqllll) === true) {
                                    echo "logout";
                                }

                            
                            }
                    }
                //*******************************************************************************
                else
                    {
                    if ($t <= $TimeArrive) 
                        {
                        $UserStat = "Arrived on time at $t";
                
                        }
                    else
                        {
                        $UserStat = "Arrived late at $t";
                        }
                    $Uname = $row['username'];
                    $Number = $row['SerialNumber'];

$sqll = "INSERT INTO logs (CardNumber, Name, SerialNumber, DateLog, TimeIn, UserStat) "
                . "VALUES ('$Card' ,'$Uname', '$Number', LEFT(DATE_ADD(NOW(),INTERVAL 3 hour), 10), DATE_ADD(CURTIME(),INTERVAL 3 hour), '$UserStat')";
                    if ($conn->query($sqll) === true)
                        {
                        echo "login";
                        }
                    } 
                }
            //**********************************************************************************
            else
                {
            echo "Cardavailable";
                }
        }
//**********************************************************************************************
        else 
        {           
        $sql = "INSERT INTO users (CardID) " . "VALUES ('$Card')";
    
        if ($conn->query($sql) === true)
            {
                echo "succesful";
            }
        }
    }
    else{
    	echo "Empty Card ID";
    }
?>
