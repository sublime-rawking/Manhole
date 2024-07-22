#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <SoftwareSerial.h>
#include <WebSocketsClient.h>

#include <Hash.h>
// #include <LiquidCrystal_I2C.h>

// LiquidCrystal_I2C lcd(0x27, 5, 4);
ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;
#define USE_SERIAL Serial1
SoftwareSerial Serial2(D5, D6);  // RX, TX



#define WIFI_SSID "myproject"  // wifi ssid 
#define WIFI_PASSWORD "12345678" // wifi password 
#define webUrl "192.168.38.175" // server ip

// pins
int liverPin = 14, waterLevelPin = 16, temperture = 0;
int prevLiverState = 0, prevWaterLevelState = 0, prevTempertureState = 0;

// devices  id  (do not change the devices id . it is config with the server)
int deviceId = 1;


DynamicJsonDocument doc(128);  // this is a var to create the json and send to server



/**
 * @brief Handles different types of WebSocket events
 * 
 * @param type The type of WebSocket event
 * @param payload The payload data received
 * @param length The length of the payload data
 */
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {

  switch (type) {
    case WStype_DISCONNECTED:
      {
        // Clear the document before adding new data
        doc.clear();  
        doc["id"] = String(deviceId);
        doc["cmd"] = "disconnected";
        String jsonString;
        serializeJson(doc, jsonString);
        webSocket.sendTXT(jsonString);
        USE_SERIAL.printf("[WSc] Disconnected!\n");
      }
      break;
    case WStype_CONNECTED:
      {
        USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);

        // send message to server when Connected
        doc.clear();  
        doc["id"] = String(deviceId);
        doc["cmd"] = "connected";
        String jsonString;
        serializeJson(doc, jsonString);
        webSocket.sendTXT(jsonString);
        Serial.println(jsonString);
      }
      break;
    case WStype_TEXT:
      USE_SERIAL.printf("[WSc] get text: %s\n", payload);

      // send message to server
      // webSocket.sendTXT("message here");
      break;
    case WStype_BIN:
      USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
      hexdump(payload, length);

      // send data to server
      // webSocket.sendBIN(payload, length);
      break;
    case WStype_PING:
      // pong will be send automatically
      USE_SERIAL.printf("[WSc] get ping\n");
      break;
    case WStype_PONG:
      // answer to a ping we send
      USE_SERIAL.printf("[WSc] get pong\n");
      break;
  }
}

void setup() {
  USE_SERIAL.begin(115200);
  Serial.begin(9600);
  Serial2.begin(9600);
  //Serial.setDebugOutput(true);

  USE_SERIAL.setDebugOutput(true);

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  WiFiMulti.addAP(WIFI_SSID, WIFI_PASSWORD);

  //WiFi.disconnect();
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  String query = "/?id=" + String(deviceId);
  webSocket.begin(webUrl, 6063, query);


  // event handler
  webSocket.onEvent(webSocketEvent);

  // use HTTP Basic Authorization this is optional remove if not needed
  webSocket.setAuthorization("user", "Password");

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);

  // start heartbeat (optional)
  // ping server every 15000 ms
  // expect pong from server within 3000 ms
  // consider connection disconnected if pong is not received 2 times
  webSocket.enableHeartbeat(15000, 3000, 2);
}

void loop() {

  // let the websocket client run
  webSocket.loop();

// only if the serial monitor have printed something
  if (Serial2.available() > 0) {

    String data = Serial2.readString();  // NAME THE RECEIVED STRING
    data.trim();  // ELIMINATE EXTRA CHARACTERS USING TRIM(), WHITESPACE
    Serial.print("Nodemcu ");   // Checking the value in serial monitor 
    Serial.println(data);     // The value in serial monitor
    webSocket.sendTXT(data); // Sending the value to server
  }

 
}
