// // Pin assignments and sensor calibration values
// #define MQ_7_PIN A1               //ch4
// #define MQ_135_PIN A7             //nh3
// #define MQ_4_PIN A3               //c0 // Analog pin where the MQ sensor is connected (A0 corresponds to analog pin 0)
// #define RL_VALUE 5                // Load resistor value in kilo ohms, used for sensor calculation
// #define RO_CLEAN_AIR_FACTOR 9.83  // Ro clean air factor, used in calibration for determining Ro in clean air
// #define ECHO_PIN 5
// #define TRIG_PIN 4
// #define IRPin A6
// #define model 1080
// // Calibration and reading settings
// #define CALIBRATION_SAMPLE_TIMES 50      // Number of samples to take during calibration
// #define CALIBRATION_SAMPLE_INTERVAL 500  // Delay between calibration samples in milliseconds
// #define READ_SAMPLE_TIMES 5              // Number of samples to take during normal operation
// #define READ_SAMPLE_INTERVAL 50          // Delay between readings during normal operation in milliseconds
// // #include <LiquidCrystal.h>                // Include the LiquidCrystal library for controlling the LCD
// #include "SharpIR.h"
// // #include "LiquidCrystal_I2C.h"
// // LCD pin setup - pins on Arduino connected to the LCD
// //const int rs = 8, en = 9, d4 = 10, d5 = 11, d6 = 12, d7 = 13;
// //LiquidCrystal lcd(rs, en, d4, d5, d6, d7); // Initialize the LiquidCrystal object with the correct pins
// // LiquidCrystal lcd(8, 9, 10, 11, 12, 13);
// // LiquidCrystal_I2C lcd(0x27, A4, A5);
// // Constants for gas types
// #define GAS_Ch4 0
// #define GAS_CO 1
// #define GAS_Smoke 2
// #define GAS_NH3 3
// SharpIR mySensor = SharpIR(IRPin, model);



// // Gas curve data for LPG, CO, and smoke. These are used to calculate gas concentration based on sensor readings
// float CH4Curve[3] = { 1.510, 0.0, -0.508 };  // {log of concentration, sensor value in clean air, slope of the curve for CH4}
// float COCurve[3] = { 1.033, 0.0, -0.477 };
// float SmokeCurve[3] = { 1.033, 0.0, -0.477 };  // {log of concentration, sensor value in clean air, slope of the curve for CO} // {log of concentration, sensor value in clean air, slope of the curve for Smoke}
// float NH3[3] = { 2, -0.0969, -0.322 };
// // Global variable to store the Ro value (sensor resistance in clean air)
// float Rco = 10.0;
// float Rch4 = 10.0;
// float RNh3 = 10.0;
// Setup function runs once when the Arduino starts
// void setup() {
//   Serial.begin(9600);
//   pinMode(TRIG_PIN, OUTPUT);
//   pinMode(ECHO_PIN, INPUT);          // Initialize serial communication at 9600 baud rate
//   Serial.println("Calibrating...");  // Print calibration message to serial monitor
//   lcd.begin(16, 2);
//   lcd.clear();
//   Serial.println("Calibrating Sensor...");
//   lcd.setCursor(0, 0);
//   lcd.print("Calibration Started");
//   // Calibrate the sensor and store the Ro value (resistance in clean air)
//   Rco = MQCalibration(MQ_7_PIN);
//   RNh3 = MQCalibration(MQ_135_PIN);
//   Rch4 = MQCalibration(MQ_4_PIN);
//   // Initialize the LCD with 16 columns and 2 rows

//   // Print calibration results to both the serial monitor and the LCD

//   Serial.println("Calibration is done...");
//   Serial.print("Rco = ");
//   Serial.print(Rco);
//   Serial.println(" kohm");

//   lcd.clear();
//   lcd.setCursor(0, 0);
//   lcd.print("Calibration done");
//   lcd.setCursor(0, 1);
//   lcd.print("Rco = ");
//   lcd.print(Rco);
//   lcd.print(" kohm");
// }

// Loop function runs repeatedly
// void loop() {
//   // Read and calculate LPG concentration in ppm
//   Serial.print("CH4: ");
//   int lpgPPM = MQGetGasPercentage(MQRead(MQ_4_PIN) / Rch4, GAS_Ch4);
//   Serial.print(lpgPPM);
//   Serial.print(" ppm    ");

//   // Read and calculate CO concentration in ppm
//   Serial.print("CO: ");
//   int coPPM = MQGetGasPercentage(MQRead(MQ_7_PIN) / Rco, GAS_CO);
//   Serial.print(coPPM);
//   Serial.print(" ppm    ");

//   // Read and calculate smoke concentration in ppm
//   Serial.print("NH3: ");
//   int nh3PPM = MQGetGasPercentage(MQRead(MQ_135_PIN) / RNh3, GAS_NH3);
//   Serial.print(nh3PPM);
//   Serial.println(" ppm");

//   // Read and calculate smoke concentration in ppm

//   float distance = readDistanceCM();
//   Serial.print("distance: ");
//   Serial.print(distance);
//   Serial.println(" cm");
//   // Display the same values on the LCD
//   int distance_lid = mySensor.getDistance();
//   Serial.print("Lidar: ");
//   Serial.print(distance_lid);
//   Serial.println(" cm");

//   lcd.clear();
//   lcd.setCursor(0, 0);
//   lcd.print("CH4: ");
//   lcd.print(lpgPPM);
//   lcd.setCursor(9, 0);
//   lcd.print("CO: ");
//   lcd.print(coPPM);
//   lcd.setCursor(0, 1);
//   lcd.print("Li: ");
//   lcd.print(distance_lid);
//   lcd.setCursor(9, 1);
//   // lcd.print("D: ");
//   // lcd.print(distance);

//   delay(200);  // Wait for 200 milliseconds before the next loop iteration
// }

/***************** MQResistanceCalculation ******************
 * This function calculates the sensor resistance (Rs) based on the ADC value (raw_adc) 
 * from the sensor. The sensor and the load resistor form a voltage divider.
 *************************************************************/
float MQResistanceCalculation(int raw_adc) {
  return (((float)RL_VALUE * (1023 - raw_adc) / raw_adc));  // Calculate Rs from ADC value
}

/***************** MQCalibration ******************************
 * This function calibrates the sensor in clean air, by reading Rs several times,
 * averaging the values, and calculating Ro (sensor resistance in clean air).
 *************************************************************/
float MQCalibration(int mq_pin) {
  int i;
  float val = 0;

  for (i = 0; i < CALIBRATION_SAMPLE_TIMES; i++) {
    val += MQResistanceCalculation(analogRead(mq_pin));  // Take multiple samples of Rs
    delay(CALIBRATION_SAMPLE_INTERVAL);                  // Wait between samples
  }

  val = val / CALIBRATION_SAMPLE_TIMES;  // Average the samples
  val = val / RO_CLEAN_AIR_FACTOR;       // Calculate Ro (sensor resistance in clean air)

  return val;
}

/***************** MQRead *************************************
 * This function reads the sensor value multiple times, calculates the average Rs,
 * and returns the average Rs value.
 *************************************************************/
float MQRead(int mq_pin) {
  int i;
  float rs = 0;

  for (i = 0; i < READ_SAMPLE_TIMES; i++) {
    rs += MQResistanceCalculation(analogRead(mq_pin));  // Calculate Rs
    delay(READ_SAMPLE_INTERVAL);                        // Wait between samples
  }

  rs = rs / READ_SAMPLE_TIMES;  // Average the samples
  return rs;
}

/***************** MQGetGasPercentage **********************
 * This function calculates the gas concentration in ppm based on the Rs/Ro ratio and 
 * the gas type (LPG, CO, or SMOKE). It selects the correct gas curve and calculates 
 * the concentration using MQGetPercentage.
 *************************************************************/
int MQGetGasPercentage(float rs_ro_ratio, int gas_id) {
  if (gas_id == GAS_Ch4) {
    return MQGetPercentage(rs_ro_ratio, CH4Curve);  // Calculate LPG concentration
  } else if (gas_id == GAS_CO) {
    return MQGetPercentage(rs_ro_ratio, COCurve);  // Calculate CO concentration
  } else if (gas_id == GAS_NH3) {
    return MQGetPercentage(rs_ro_ratio, NH3);  // Calculate smoke concentration
  } else if (gas_id == GAS_Smoke) {
    return MQGetPercentage(rs_ro_ratio, SmokeCurve);  // Calculate smoke concentration
  }
  return 0;
}

float readDistanceCM() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  int duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2;
}

/***************** MQGetPercentage ****************************
 * This function calculates the gas concentration (in ppm) using the sensor's Rs/Ro ratio 
 * and the gas curve data. It uses the logarithmic curve to derive the gas concentration.
 *************************************************************/
int MQGetPercentage(float rs_ro_ratio, float *pcurve) {
  // Using the logarithmic curve formula to calculate ppm
  return (pow(10, ((log(rs_ro_ratio) - pcurve[1]) / pcurve[2] + pcurve[0])));
}
