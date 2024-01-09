/*
 * WebSocketClient.ino
 *
 *  Created on: 24.05.2015
 *
 */

#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <WebSocketsClient.h>

#include <Hash.h>
// #include <LiquidCrystal_I2C.h>

// LiquidCrystal_I2C lcd(0x27, 5, 4);
ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;
#define USE_SERIAL Serial1



#define WIFI_SSID "Sami Infotech Mach1_2.4G"
#define WIFI_PASSWORD "Falcon@F21"
#define webUrl "192.168.0.141"

// pins
int liverPin = 14, waterLevelPin = 16, temperture = 0;
int prevLiverState = 0, prevWaterLevelState = 0, prevTempertureState = 0;

// devices  id
int deviceId = 1;


DynamicJsonDocument doc(128);



void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {

  switch (type) {
    case WStype_DISCONNECTED:
      {
        doc.clear();  // Clear the document before adding new data
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
        doc.clear();  // Clear the document before adding new data
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
  // Serial.begin(115200);
  Serial.begin(9600);
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
  webSocket.loop();

  if (Serial.available() > 0) {

    String data = Serial.readString();  // NAME THE RECEIVED STRING
    data.trim();
    Serial.println(data);  // ELIMINATE EXTRA CHARACTERS USING TRIM(), WHITESPACE
    webSocket.sendTXT(data);
  }
  // liverReading();
  // waterLevelFunc();
  // getTempreture();
  // lcd.setCursor(0, 0);
  // lcd.print("Blockage : " + String(waterLevel ? "True " : "False"));
  // lcd.setCursor(0, 1);  // Set cursor to the beginning of the second line
  // lcd.print("Liver State: " + String(liverState ? "OFF " : "ON "));
}
