// #include <LiquidCrystal.h>
#include <ArduinoJson.h>
#include <SoftwareSerial.h>
#include "SharpIR.h"
#include "LiquidCrystal_I2C.h"

SoftwareSerial Serial2(7, 6);

// Define the pin connections for the sensors and devices
const int waterLevelPin = 3;  // Analog pin for water level sensor  (green for water)
const int liverPin = 2;       // Digital pin for liver sensor (white for lever )
const int batteryPin = A7;    // Analog pin for battery voltage sensor
// Define the thresholds for low battery and battery voltage difference
float lowBatteryThreshold = 0.0;        // Below this voltage, the battery is considered low
const float batteryVoltageDiff = 0.10;  // Difference in battery voltage to trigger charging or discharging

// Initialize variables to store previous sensor states
int prevLiverState = 0;       // Previous state of the liver sensor
int prevWaterLevelState = 0;  // Previous state of the water level sensor

// Initialize the LCD display = 0.10;  // Difference in battery voltage to trigger charging or discharging

// Initialize the LCD display
// LiquidCrystal lcd(8, 9, 10, 11, 12, 13);
// LCD pin setup - pins on Arduino connected to the LCD
LiquidCrystal_I2C lcd(0x27, A4, A5);

// Define the JSON document for sending data to the server
DynamicJsonDocument doc(128);

// Define the device ID
const int deviceId = 1;
// Pin assignments and sensor calibration values
#define MQ_7_PIN A2               //ch4
#define MQ_135_PIN A1             //nh3
#define MQ_4_PIN A3               //c0 // Analog pin where the MQ sensor is connected (A0 corresponds to analog pin 0)
#define RL_VALUE 5                // Load resistor value in kilo ohms, used for sensor calculation
#define RO_CLEAN_AIR_FACTOR 9.83  // Ro clean air factor, used in calibration for determining Ro in clean air
#define ECHO_PIN 5
#define TRIG_PIN 4
#define IRPin A6
#define model 1080
// Calibration and reading settings
#define CALIBRATION_SAMPLE_TIMES 50      // Number of samples to take during calibration
#define CALIBRATION_SAMPLE_INTERVAL 500  // Delay between calibration samples in milliseconds
#define READ_SAMPLE_TIMES 5              // Number of samples to take during normal operation
#define READ_SAMPLE_INTERVAL 50          // Delay between readings during normal operation in milliseconds


// Constants for gas types
#define GAS_Ch4 0
#define GAS_CO 1
#define GAS_Smoke 2
#define GAS_NH3 3
SharpIR mySensor = SharpIR(IRPin, model);

Vector<String> sendingData = {};

int runningCondition = 1, lpgPPM = 0, coPPM = 0, distance_lid = 0, nh3PPM = 0;

bool waterLevel = false, liverState = false;
// Gas curve data for LPG, CO, and smoke. These are used to calculate gas concentration based on sensor readings
float CH4Curve[3] = { 1.510, 0.0, -0.508 };  // {log of concentration, sensor value in clean air, slope of the curve for CH4}
float COCurve[3] = { 1.033, 0.0, -0.477 };
float SmokeCurve[3] = { 1.033, 0.0, -0.477 };  // {log of concentration, sensor value in clean air, slope of the curve for CO} // {log of concentration, sensor value in clean air, slope of the curve for Smoke}
float NH3[3] = { 2, -0.0969, -0.322 };
// Global variable to store the Ro value (sensor resistance in clean air)
float Rco = 10.0;
float Rch4 = 10.0;
float RNh3 = 10.0;
/**
 * @brief Setup function runs once when the Arduino board turns on
 * 
 * This function initializes the serial communication, sets up the LCD,
 * sets the pin modes for the sensors and gets the initial state of the sensors.
 */
void setup() {
  // Setup serial communication at 9600 baud rate
  Serial.begin(9600);

  // Initialize the LCD display with 16 columns and 2 rows
  lcd.begin(16, 2);
  pinMode(7, OUTPUT);
  // Set pin modes for the sensors
  pinMode(batteryPin, INPUT_PULLUP);
  pinMode(liverPin, INPUT_PULLUP);

  // Get the initial state of the sensors
  prevLiverState = digitalRead(liverPin);
  prevWaterLevelState = digitalRead(waterLevelPin);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);  // Initialize serial communication at 9600 baud rate
  lcd.begin(16, 2);
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Calibration Started");
  // Calibrate the sensor and store the Ro value (resistance in clean air)
  if (prevLiverState) {

    Rco = MQCalibration(MQ_7_PIN);
    RNh3 = MQCalibration(MQ_135_PIN);
    Rch4 = MQCalibration(MQ_4_PIN);
  }
  // Initialize the LCD with 16 columns and 2 rows


  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Calibration done");
  lcd.setCursor(0, 1);
  lcd.print("Rco = ");
  lcd.print(Rco);
  lcd.print(" kohm");
}

/**
 * @brief The main loop function
 * 
 * This function is called repeatedly and is responsible for getting the sensor readings
 * and displaying them on the LCD.
 */
void loop() {
  // // Get the sensor readings
  // bool waterLevel = waterLevelFunc();
  // delay(800);  // Wait for 200 milliseconds before the next loop iteration


  // bool liverState = liverReading();
  // delay(800);  // Wait for 200 milliseconds before the next loop iteration

  // int lpgPPM = MQGetGasPercentage(MQRead(MQ_4_PIN) / Rch4, GAS_Ch4);
  // sendSensorValue(lpgPPM, "ppm", "CH4");
  // delay(800);  // Wait for 200 milliseconds before the next loop iteration

  // int coPPM = MQGetGasPercentage(MQRead(MQ_7_PIN) / Rco, GAS_CO);
  // sendSensorValue(coPPM, "ppm", "CO");
  // delay(800);  // Wait for 200 milliseconds before the next loop iteration

  // int nh3PPM = MQGetGasPercentage(MQRead(MQ_135_PIN) / RNh3, GAS_NH3);
  // sendSensorValue(nh3PPM, "ppm", "NH3");
  // delay(800);  // Wait for 200 milliseconds before the next loop iteration

  // // float distance = readDistanceCM();
  // int distance_lid = mySensor.distance();
  // sendSensorValue(distance_lid, "cm", "Lidar");


  switch (runningCondition) {
    case 1:
      waterLevel = digitalRead(waterLevelPin);
      sendSensorValue(waterLevel, "", "waterState");
      runningCondition++;
      break;

    case 2:
      liverState = digitalRead(liverPin);
      sendSensorValue(liverState, "", "liverState");
      if (liverState) {

        Serial.println(liverState);
        SendMessage();
      }
      runningCondition++;
      break;

    case 3:
      lpgPPM = MQGetGasPercentage(MQRead(MQ_4_PIN) / Rch4, GAS_Ch4);
      sendSensorValue(lpgPPM, "ppm", "CH4");
      runningCondition++;
      break;

    case 4:
      coPPM = MQGetGasPercentage(MQRead(MQ_7_PIN) / Rco, GAS_CO);
      sendSensorValue(coPPM, "ppm", "CO");
      runningCondition++;
      break;

    case 5:
      nh3PPM = MQGetGasPercentage(MQRead(MQ_135_PIN) / RNh3, GAS_NH3);
      sendSensorValue(nh3PPM, "ppm", "NH3");
      runningCondition++;
      break;

    case 6:
      distance_lid = mySensor.distance();
      sendSensorValue(distance_lid, "cm", "Lidar");
      runningCondition++;
      break;

    default:
      runningCondition = 1;
  }

  // Display the sensor readings on the LCD
  // lcd.setCursor(0, 0);
  // lcd.print("B " + String(waterLevel ? "Yes" : "No"));
  // lcd.setCursor(10, 0);  // Set cursor to the beginning of the second line
  // lcd.print("L " + String(liverState ? "OFF " : "ON "));

  // String pStatus = getBattery();

  // lcd.setCursor(10, 1);  // Set cursor to the beginning of the second line
  // lcd.print("P " + String(pStatus));

  // Delay for 2 seconds to avoid too many updates to the LCD
  // delay(2000);

  /**
   * @brief Control the charging relay based on battery voltage
   * 
   * This block of code controls the charging relay based on the battery voltage.
   * If the battery voltage is lower than 3.6V, the relay is turned on to start charging.
   * If the battery voltage is more than 3.9V, the relay is turned off to stop charging.
   */
  // if (pStatus == "Low") {
  //   digitalWrite(7, HIGH);  // Relay connected to D7 is turned on
  // } else if (pStatus == "High") {
  //   digitalWrite(7, LOW);  // Relay connected to D7 is turned off
  // }

  // Read and calculate CH4 concentration in ppm
  // sendSensorValue(lpgPPM, "ppm", "CH4");

  // // Read and calculate CO concentration in ppm
  // sendSensorValue(coPPM, "ppm", "CO");

  // // Read and calculate smoke concentration in ppm
  // sendSensorValue(nh3PPM, "ppm", "NH3");


  // Display the same values on the LCD


  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("CH4: ");
  lcd.print(lpgPPM);
  lcd.setCursor(9, 0);
  lcd.print("CO: ");
  lcd.print(coPPM);
  lcd.setCursor(0, 1);
  lcd.print("Li: ");
  lcd.print(distance_lid);
  lcd.setCursor(9, 1);
  lcd.print("L " + String(liverState ? "OFF " : "ON "));

  delay(1000);  // Wait for 200 milliseconds before the next loop iteration
}
