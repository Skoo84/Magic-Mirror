/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
	address: "localhost", // Address to listen on, can be:
	                      // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	                      // - another specific IPv4/6 to listen on a specific interface
	                      // - "", "0.0.0.0", "::" to listen on any interface
	                      // Default, when address config is left out, is "localhost"
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
	                                                       // or add a specific IPv4 of 192.168.1.5 :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	                                                       // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	language: "en",
	timeFormat: 24,
	units: "metric",

	modules: [
{
            module: 'MMM-GoogleTasks',
            header: "Google Tasks",
            position: "top_center",
            config: {
                listID: "*****"
            }
        },
	

{
  module: 'MMM-LocalTransport',
  header: 'to Work',
  position: 'bottom_right',
  config: {
    api_key: 'AIzaSyDqd*********sE',
    origin: '*****, Cluj-Napoca, Romania',
    destination: '*********, Cluj-Napoca, Romania',
    maximumEntries: 3,
    maxWalkTime: 3,
displayWalkType: 'none',
displayStationLength: -1,
    displayStationLength: -1
  }
},
{
  module: 'MMM-LocalTransport_2',
  header: 'to Main Square',
  position: 'bottom_left',
  config: {
    api_key: 'AIz*********Z_yNtAUkjKqsE',
    origin: '********, Cluj-Napoca, Romania',
    destination: '********, Cluj-Napoca, Romania',
    maximumEntries: 3,
    maxWalkTime: 10,
displayWalkType: 'none',
displayStationLength: -1,
    displayStationLength: -1
  }
},


         {

            module: 'MMM-Carousel',
            position: 'bottom_bar', // Required only for navigation controls
            config: {
                transitionInterval: 15000,

                showPageIndicators: true,
                showPageControls: true,
                ignoreModules: ['alert'],
                mode: 'slides',
                slides: {
                    main: ['clock','MMM-SystemStats','weatherforecast','calendar','updatenotification','alert','calendar', 'compliments', 'currentweather','newsfeed','MMM-MysqlQuery'],
                    "Slide 2": ['MMM-MysqlQuery_2', 'MMM-MysqlQuery_3', 'MMM-MysqlQuery_4'],
"Slide 3": ['MMM-LocalTransport_2','MMM-LocalTransport','MMM-GoogleTasks'],
                    "Slide 4": ['clock','MMM-SystemStats','weatherforecast','calendar','updatenotification','alert','calendar', 'compliments', 'currentweather','newsfeed','MMM-MysqlQuery'],

                }
            }
        },
{
            module: "MMM-MysqlQuery", position: "bottom_left", header: 'Realtime Sensor Data (Celsius/RH)',
            config: {
                connection: {
                    host: "*****.******.eu-central-1.rds.amazonaws.com",
                    port: 3306,
                    user: "******",
                    password: "*******",
                    database: "nodemcuweather"
                },
                query: `SELECT
        'Warehouse' AS sensor,
        warehouse.temp,
        warehouse.hum,
        warehouse.measured_on,
        IFNULL((select time_desc  from time_passed where time_minute = TIMESTAMPDIFF(MINUTE,warehouse.measured_on,DATE_ADD(NOW(),INTERVAL 3 HOUR))), 'Data is old!') AS Latest_Time
    FROM
        warehouse 
    WHERE
        warehouse.id = (
            SELECT
                max(warehouse.id) 
            FROM
                warehouse
        ) 
UNION ALL 
SELECT
        'Production' AS sensor,
        production.temp,
        production.hum,
        production.measured_on,
        IFNULL((select time_desc  from time_passed where time_minute = TIMESTAMPDIFF(MINUTE,production.measured_on,DATE_ADD(NOW(),INTERVAL 3 HOUR))), 'Data is old!') AS Latest_Time
    FROM
        production 
    WHERE
        production.id = (
            SELECT
                max(production.id) 
            FROM
                production
        ) 
UNION ALL
SELECT
        'Finished Goods' AS sensor,
        finished_goods.temp,
        finished_goods.hum,
        finished_goods.measured_on,
        IFNULL((select time_desc  from time_passed where time_minute = TIMESTAMPDIFF(MINUTE,finished_goods.measured_on,DATE_ADD(NOW(),INTERVAL 3 HOUR))), 'Data is old!') AS Latest_Time
    FROM
        finished_goods 
    WHERE
        finished_goods.id = (
            SELECT
                max(finished_goods.id) 
            FROM
                finished_goods
        )
        UNION ALL
        SELECT
        'Basement' AS sensor,
        basement.temp,
        basement.hum,
        basement.measured_on,
        IFNULL((select time_desc  from time_passed where time_minute = TIMESTAMPDIFF(MINUTE,basement.measured_on,DATE_ADD(NOW(),INTERVAL 3 HOUR))), 'Data is old!') AS Latest_Time
    FROM
        basement
    WHERE
        basement.id = (
            SELECT
                max(basement.id) 
            FROM
                basement
        )
        ;`,
	    			intervalSeconds: 60,
                 emptyMessage: "No spices", 
                columns: [
               
	                   
	                    { name: "sensor",  title: "Sensor"     },
 { name: "temp" , title: "Temperature"      },
	                    { name: "hum"  , title: "Humidity"  },
{ name: "Latest_Time" , title: "Measured"    }
			
                ]
            }
        },

{
            module: "MMM-MysqlQuery_2", position: "middle_center", header: 'Temperature averages (Celsius)',
            config: {
                connection: {
                    host: "*****.******.eu-central-1.rds.amazonaws.com",
                    port: 3306,
                    user: "******",
                    password: "*******",
                    database: "nodemcuweather"
                },
                query: `SELECT * from stats`,
	    			intervalSeconds: 15 * 60,
                emptyMessage: "No spices", 
                columns: [
                   { name: "SensorName", title: "Location"      },
	                   
	                    { name: "Daily",      },
 { name: "Weekly"      },
	                    { name: "Monthly"    },
{ name: "Yearly"    }
			
                ]
            }
        },
{
            module: "MMM-MysqlQuery_3", position: "middle_center", header: 'Who Is Working Today?',
            config: {
                connection: {
                    host: "******.*******.eu-central-1.rds.amazonaws.com",
                    port: 3306,
                    user: "*******",
                    password: "******",
                    database: "nodemcuweather"
                },
                query: `SELECT Name, TimeIn, TimeOut, UserStat, WorkedToday FROM nodemculog.logs where DateLog = DATE(DATE_ADD( now(), INTERVAL 3 hour));`,
	    			intervalSeconds: 15 * 60,
                emptyMessage: "Nobody is here, yet", 
                columns: [
                   { name: "Name", title: "Name"      },
	                   
	                    { name: "TimeIn",      },
 { name: "TimeOut"      },
	                    { name: "UserStat", title: "Comments"   },
{ name: "WorkedToday", title: "Hours Worked"    }
			
                ]
            }
        },
{
            module: "MMM-MysqlQuery_4", position: "middle_center", header: "Yesterday's Employee Attendance",
            config: {
                connection: {
                    host: "****.******.eu-central-1.rds.amazonaws.com",
                    port: 3306,
                    user: "****",
                    password: "*****",
                    database: "nodemcuweather"
                },
                query: `SELECT Name, TimeIn, TimeOut, UserStat, WorkedToday FROM nodemculog.logs where DateLog = DATE(DATE_ADD( now(), INTERVAL -21 hour));`,
	    			intervalSeconds: 15 * 60,
                emptyMessage: "Nobody was working", 
                columns: [
                   { name: "Name", title: "Name"      },
	                   
	                    { name: "TimeIn",      },
 { name: "TimeOut"      },
	                    { name: "UserStat", title: "Comments"   },
{ name: "WorkedToday", title: "Hours Worked"    }
			
                ]
            }
        },

		{
			module: "alert",
		},
		{
			module: "ccccc",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "Calendar",
			position: "top_left",
			config: {
				calendars: [
					{
						symbol: "calendar-check",
						url: "webcal://www.calendarlabs.com/ical-calendar/ics/64/Romania_Holidays.ics"					},
{
						symbol: "calendar-plus-o",
						url: "webcal://calendar.google.com/calendar/ical/*****%40gmail.com/private-ce35*****d6907c/basic.ics"			}
				]
			}
		},
		{
			module: "compliments",
			position: "lower_third"
		},
		{
			module: "currentweather",
			position: "top_right",
			config: {
				location: "Cluj-Napoca",
				locationID: "681290",  //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				appid: "b*******1"
			}
		},
		{
			module: "weatherforecast",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				location: "Cluj-Napoca",
				locationID: "681290",  //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				appid: "b2*********211"
			}
		},
{
		module: 'MMM-SystemStats',
		position: 'bottom_right', // This can be any of the regions.
		// classes: 'small dimmed', // Add your own styling. OPTIONAL.
		 header: 'System Stats', // Set the header text OPTIONAL
		config: {
			updateInterval: 10000, // every 10 seconds
			align: 'right', // align labels
			header: 'System Stats', // This is optional
			units: 'metric', // default, metric, imperial
			label: 'icon',
		}
	},


		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
{
				title: "Cosmetics news",
				url: "https://globalcosmeticsnews.com/feed/",
				encoding: "UTF-8" //ISO-8859-1
			},

{
				title: "Top news",
				url: "https://news.google.com/news/rss",
				encoding: "UTF-8" //ISO-8859-1
			},
{
				title: "Cosmetics news",
				url: "https://news.google.com/rss/search?q=cosmetics&hl=en-GB&gl=GB&ceid=GB:en",
				encoding: "UTF-8" //ISO-8859-1
			},

{
				title: "Reddit",
				url: "http://www.reddit.com/.rss",
				encoding: "UTF-8" //ISO-8859-1
			},
{
				title: "New York Times",
				url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml",
				encoding: "UTF-8" //ISO-8859-1
			}

					
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true
			}
		}
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
