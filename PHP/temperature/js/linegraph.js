$(document).ready(function() {

  /**
   * call the data.php file to fetch the result from db table.
   */
  $.ajax({
    url : "http://localhost/nodemcu/read_all.php?loc=warehouse",
    type : "GET",
    success : function(data){
      console.log(data);

      var score = {
        temp : [],
        hum : []
      };

      var len = data.length;

      for (var i = 0; i < len; i++) {
        if (data[i].team == "temp") {
          score.temp.push(data[i].score);
        }
        else if (data[i].team == "hum") {
          score.hum.push(data[i].score);
        }
      }

      //get canvas
      var ctx = $("#line-chartcanvas");

      var data = {
        labels : ["match1", "match2", "match3", "match4", "match5"],
        datasets : [
          {
            label : "temp score",
            data : score.temp,
            backgroundColor : "blue",
            borderColor : "lightblue",
            fill : false,
            lineTension : 0,
            pointRadius : 5
          },
          {
            label : "hum score",
            data : score.hum,
            backgroundColor : "green",
            borderColor : "lightgreen",
            fill : false,
            lineTension : 0,
            pointRadius : 5
          }
        ]
      };

      var options = {
        title : {
          display : true,
          position : "top",
          text : "Line Graph",
          fontSize : 18,
          fontColor : "#111"
        },
        legend : {
          display : true,
          position : "bottom"
        }
      };

      var chart = new Chart( ctx, {
        type : "line",
        data : data,
        options : options
      } );

    },
    error : function(data) {
      console.log(data);
    }
  });

});
