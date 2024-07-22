#include <LiquidCrystal.h>
#include <ArduinoJson.h>


// Define the pin connections for the sensors and devices
const int waterLevelPin = A4; // Analog pin for water level sensor
const int temperturePin = A3; // Analog pin for temperature sensor
const int liverPin = A5; // Digital pin for liver sensor
const int batteryPin = A2; // Analog pin for battery voltage sensor

// Define the thresholds for low battery and battery voltage difference
const float lowBatteryThreshold = 0.0; // Below this voltage, the battery is considered low
const float batteryVoltageDiff = 0.10; // Difference in battery voltage to trigger charging or discharging

// Initialize variables to store previous sensor states
int prevLiverState = 0; // Previous state of the liver sensor
int prevWaterLevelState = 0; // Previous state of the water level sensor
float prevTemperatureState = 0; // Previous temperature reading

// Initialize the LCD display
LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

// Initialize variables for water level sensors
int fullWaterSensor = 1;
int midWaterSensor = 1;
int bottomWaterSensor = 1;

// Define the JSON document for sending data to the server
DynamicJsonDocument doc(128);

// Define the device ID
const int deviceId = 1;

/**
 * @brief Setup function runs once when the Arduino board turns on
 * 
 * This function initializes the serial communication, sets up the LCD,
 * sets the pin modes for the sensors and gets the initial state of the sensors.
 */
void setup() {
  // Setup serial communication at 9600 baud rate
  uint32_t baud = 9600;
  Serial.begin(baud);
  
  // Initialize the LCD display with 16 columns and 2 rows
  lcd.begin(16, 2);
  pinMode(7 , OUTPUT);
  // Set pin modes for the sensors
  pinMode(batteryPin, INPUT_PULLUP);
  pinMode(liverPin, INPUT_PULLUP);
  pinMode(temperture, INPUT_PULLUP);
  
  // Get the initial state of the sensors
  prevLiverState = digitalRead(liverPin);
  prevWaterLevelState = digitalRead(waterLevelPin);
  prevTemperatureState = analogRead(temperture);
}

/**
 * @brief The main loop function
 * 
 * This function is called repeatedly and is responsible for getting the sensor readings
 * and displaying them on the LCD.
 */
void loop() {
  // Get the sensor readings
  bool waterLevel = waterLevelFunc();
  bool liverState = liverReading();
  int temputureState = getTempreture();

  // Display the sensor readings on the LCD
  lcd.setCursor(0, 0);
  lcd.print("B " + String(waterLevel ? "Yes" : "No"));
  lcd.setCursor(10, 0);  // Set cursor to the beginning of the second line
  lcd.print("L " + String(liverState ? "OFF " : "ON "));

  String pStatus = getBattery();

  lcd.setCursor(10, 1);  // Set cursor to the beginning of the second line
  lcd.print("P " + String(pStatus));

  // Delay for 2 seconds to avoid too many updates to the LCD
  delay(2000);

  /**
   * @brief Control the charging relay based on battery voltage
   * 
   * This block of code controls the charging relay based on the battery voltage.
   * If the battery voltage is lower than 3.6V, the relay is turned on to start charging.
   * If the battery voltage is more than 3.9V, the relay is turned off to stop charging.
   */
  if (pStatus == "Low") {
    digitalWrite(7, HIGH);  // Relay connected to D7 is turned on
  } else if (pStatus == "High") {
    digitalWrite(7, LOW);  // Relay connected to D7 is turned off
  }

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
  if (abs(batteryVoltage - lowBattery) >= batteryDiff) {
    lowBattery = batteryVoltage;

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

float getTempreture() {
  // Convert the analog reading to voltage
  float voltage = (float)analogRead(temperture) * 5.0 / 1023.0;

  // Convert voltage to celsius
  float celsius = (1024 - voltage) / 23;

  // Send a webSocket message if the temperature has changed by at least 2 degrees
  if (abs(prevTemperatureState - celsius) >= 2) {
    prevTemperatureState = celsius;

    // Create a JSON document with the new temperature
    doc.clear();
    doc["id"] = String(deviceId);
    doc["key"] = "tempretureState";
    doc["cmd"] = "update";
    doc["value"] = prevTemperatureState;
    String jsonString;
    serializeJson(doc, jsonString);

    // Update the LCD with the new temperature
    lcd.setCursor(0, 1);
    lcd.print("T " + String(prevTemperatureState));

    // Send the JSON document over the webSocket
    Serial.println(jsonString);
  }

  return celsius;
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
    Serial.println(jsonString);
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

  // Return the reading state
  bool reading = sensorReading == LOW;

  return reading;
}
