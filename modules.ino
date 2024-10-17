
void sendSensorValue(int value, String units, String keyName) {
  // Serial2.println(String(keyName) + ": " + String(value) + " " + String(units));

  doc.clear();
  doc["id"] = String(deviceId);
  doc["key"] = keyName;
  doc["cmd"] = "update";
  doc["value"] = value;


  // Convert the document to a JSON string
  String jsonString;
  serializeJson(doc, jsonString);
  // Send the JSON string over the WebSocket
  Serial.println(jsonString);
  Serial.flush();
}



String getBattery() {
  // Read the battery voltage
  float batteryVoltage = analogRead(batteryPin) / 102.4;

  // Check if the battery voltage is low
  if (batteryVoltage < 3.6) {
    digitalWrite(7, HIGH);  // Turn on the charging relay
  } else {
    digitalWrite(7, LOW);  // Turn off the charging relay
  }

  // Check if the battery voltage has changed by at least 20%
  if (abs(batteryVoltageDiff - lowBatteryThreshold) >= batteryVoltageDiff) {
    lowBatteryThreshold = batteryVoltage;

    // Create a JSON document to send to the server
    doc.clear();
    doc["id"] = String(deviceId);
    doc["key"] = "batteryStatus";
    doc["cmd"] = "update";

    if (batteryVoltage >= 7.8) {
      doc["value"] = "full";
    } else if (batteryVoltage < 7.8 && batteryVoltage >= 7.3) {
      doc["value"] = "mid";
    } else {
      doc["value"] = "low";
    }

    // Convert the JSON document to a string
    String jsonString;
    serializeJson(doc, jsonString);

    // Send the JSON string to the server
    Serial.println(jsonString);
  }

  // Return the battery voltage as a string
  return String(batteryVoltage);
}


bool waterLevelFunc() {
  // Get the current state of the water level sensor
  int waterLevelState = digitalRead(waterLevelPin);

  // If the state has changed, update the LCD and send a WebSocket message
  if (prevWaterLevelState != waterLevelState) {
    prevWaterLevelState = waterLevelState;

    // Update the LCD display
    lcd.setCursor(0, 0);
    lcd.print("B " + String(waterLevelState ? "ON " : "OFF"));

    // Create a JSON document with the new water level state
    doc.clear();  // Clear the document before adding new data
    doc["id"] = String(deviceId);
    doc["key"] = "waterState";
    doc["cmd"] = "update";
    doc["value"] = waterLevelState;
    String jsonString;
    serializeJson(doc, jsonString);

    // Send the JSON document over the webSocket
    // Serial.println(jsonString);
  }

  // Return the water level state
  return waterLevelState == 1 ? false : true;
}

bool liverReading() {
  // Read the state of the liver sensor
  int sensorReading = digitalRead(liverPin);

  // If the state has changed, update the LCD and send a WebSocket message
  if (prevLiverState != sensorReading) {
    prevLiverState = sensorReading;

    // Update the document with the new state
    doc.clear();
    doc["id"] = String(deviceId);
    doc["key"] = "liverState";
    doc["cmd"] = "update";
    doc["value"] = prevLiverState;

    // Convert the document to a JSON string
    String jsonString;
    serializeJson(doc, jsonString);

    // Send the JSON string over the WebSocket
    Serial.println(jsonString);
  }



  return sensorReading == 1 ? false : true;
}

void SendMessage() {
  Serial2.println("AT+CMGF=1");                    //Sets the GSM Module in Text Mode
  delay(1000);                                     // Delay of 1000 milli seconds or 1 second
  Serial2.println("AT+CMGS=\"+919819535276\"\r");  // Replace x with mobile number
  delay(1000);
  Serial2.println("I am SMS from GSM Module");  // The SMS text you want to send
  delay(100);
  Serial2.println((char)26);  // ASCII code of CTRL+Z
  delay(1000);
}


void RecieveMessage() {
  Serial2.println("AT+CNMI=2,2,0,0,0");  // AT Command to receive a live SMS
  delay(1000);
}
