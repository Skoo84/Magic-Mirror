#ifdef ESP32
  #include <WiFi.h>
  #include <HTTPClient.h>
#else
  #include <ESP8266WiFi.h>
  #include <ESP8266HTTPClient.h>
  #include <WiFiClient.h>
#endif
#include "DHT.h"        // including the library of DHT11 temperature and humidity sensor
#define DHTTYPE DHT11   // DHT 11 or 22

#define dht_dpin 0
const char* ssid     = "*****";
const char* password = "******";
const char* host = "http://******-env.******.eu-central-1.elasticbeanstalk.com/temperature/insert.php";
String location = "warehouse";
DHT dht(dht_dpin, DHTTYPE); 
void setup(void)
{ 
  dht.begin();
  Serial.begin(9600);
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password); 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
 
  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Netmask: ");
  Serial.println(WiFi.subnetMask());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());
  Serial.println("Humidity and temperature\n\n");
  delay(700);

}
void loop() {
    
if(WiFi.status()== WL_CONNECTED){
    HTTPClient http;
    //Creating the dataline for the get request
    String dataline = String(host);
  dataline += "?loc=" + String(location);
  dataline += "&temp=" + String(dht.readTemperature(), 1); //2 decimal places
  dataline += "&hum=" + String(dht.readHumidity(), 1);
    
    http.begin(dataline);
    
   //Printing the request
    Serial.print("dataline: ");
    Serial.println(dataline);
    

    // Send GET request
    int httpResponseCode = http.GET();
    String payload = http.getString();
     
  //getting response
        
    if (httpResponseCode>0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.println(payload); 
      
    }
    else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
      Serial.println(payload); 
    }
    // Free resources
    http.end();
  }
  else {
    Serial.println("WiFi Disconnected");
  }
  //Send an HTTP POST request every 5 minutes
  delay(300000);  
}
