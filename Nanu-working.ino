#include <LiquidCrystal.h>
#include <ArduinoJson.h>


int waterLevelPin = A4;
int temperture = A7;
int liverPin = A5;
int batteryPin = A3;
int lowBattery = 0;
int prevLiverState = 0, prevWaterLevelState = 0;
float prevTemputureState = 0;
LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

// #include <SoftwareSerial.h>

// SoftwareSerial s(5, 6);
// for Tempreture Sensor reading
int Vo;
float R1 = 10000;
float logR2, R2, T, Tc, Tf;
float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;

int full_sensor = 1;
int mid_sensor = 1;
int bottom_sensor = 1;
DynamicJsonDocument doc(128);
int deviceId = 1;


void setup() {
  uint32_t baud = 9600;
  Serial.begin(baud);
  // setUpWIFI();

  lcd.begin(16, 2);
  // lcd.init();
  // lcd.backlight();
  pinMode(7, OUTPUT);
  pinMode(batteryPin, INPUT_PULLUP);
  pinMode(liverPin, INPUT_PULLUP);
  pinMode(temperture, INPUT_PULLUP);
  // lowBattery = digitalRead(batteryPin) / 100 ;
  prevLiverState = digitalRead(liverPin);
  prevWaterLevelState = digitalRead(waterLevelPin);
  prevTemputureState = analogRead(temperture);
}

void loop() {
  // put your main code here, to run repeatedly:
  bool waterLevel = waterLevelFunc();
  bool liverState = liverReading();
  int temputureState = getTempreture();

  lcd.setCursor(0, 0);
  lcd.print("Blockage : " + String(waterLevel ? "True " : "False"));
  lcd.setCursor(0, 1);  // Set cursor to the beginning of the second line
  lcd.print("Liver State: " + String(liverState ? "OFF " : "ON "));

  getBattery();



  delay(2000);
  // D7 relay
  // lower than 3.6 . need charging . turn on relay
  // more then 3.9 . stop charging . turn off relay
}

float getBattery() {
  float value = analogRead(batteryPin) / 100;
  if (value < 3.6) {
    digitalWrite(7, HIGH);

  } else {
    digitalWrite(7, LOW);
  }


  if (digitalRead(7) != lowBattery) {
    lowBattery = digitalRead(7);
    if (value < 3.6) {
      digitalWrite(7, HIGH);
      doc.clear();  // Clear the document before adding new data
      doc["id"] = String(deviceId);
      doc["key"] = "batteryStatus";
      doc["cmd"] = "update";
      doc["value"] = "Low";
      String jsonString;
      serializeJson(doc, jsonString);

      Serial.println(jsonString);
    } else {
      digitalWrite(7, LOW);
      doc.clear();  // Clear the document before adding new data
      doc["id"] = String(deviceId);
      doc["key"] = "batteryStatus";
      doc["cmd"] = "update";
      doc["value"] = "Charged";
      String jsonString;
      serializeJson(doc, jsonString);

      Serial.println(jsonString);
    }
  }
}

float getTempreture() {
  // int Temp = analogRead(temperture);
  // float voltage = Temp * 5.0 / 1023.0;  // Convert to voltage
  // float celsius = (voltage - 0.5) / 0.01;
  // Serial.println(Temp);
  // Serial.println(220 - celsius);
  float Temp = analogRead(temperture);
  float celsius = (1024 - Temp) / 23;

  // 1024 - temp   = value / ? = to get room tempreture .

  // Serial.println(celsius);
  if (abs(prevTemputureState - celsius) >= 2) {
    prevTemputureState = celsius;
    // webSocket.sendTXT("Change in prevWaterLevelState");
    doc.clear();  // Clear the document before adding new data
    doc["id"] = String(deviceId);
    doc["key"] = "tempretureState";
    doc["cmd"] = "update";
    doc["value"] = prevTemputureState;
    String jsonString;
    serializeJson(doc, jsonString);

    Serial.println(jsonString);
  }

  return celsius;
}




bool waterLevelFunc() {
  // lcd.setCursor(0, 0);
  // Serial.println("Water Level High: " + String(digitalRead(waterLevelPin)));
  if (prevWaterLevelState != digitalRead(waterLevelPin)) {
    prevWaterLevelState = digitalRead(waterLevelPin);
    // webSocket.sendTXT("Change in prevWaterLevelState");
    doc.clear();  // Clear the document before adding new data
    doc["id"] = String(deviceId);
    doc["key"] = "waterState";
    doc["cmd"] = "update";
    doc["value"] = prevWaterLevelState;
    String jsonString;
    serializeJson(doc, jsonString);
    Serial.println(jsonString);
  }

  return digitalRead(waterLevelPin) == 1 ? false : true;
}

bool liverReading() {
  int sensorReading = digitalRead(liverPin);
  // lcd.setCursor(0, 1);
  if (prevLiverState != sensorReading) {
    prevLiverState = sensorReading;
    doc.clear();  // Clear the document before adding new data
    doc["id"] = String(deviceId);
    doc["key"] = "liverState";
    doc["cmd"] = "update";
    doc["value"] = prevLiverState;
    String jsonString;
    serializeJson(doc, jsonString);
    Serial.println(jsonString);
  }

  bool reading = sensorReading == LOW;


  return reading;
}
