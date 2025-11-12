#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// Replace with your network credentials
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// Replace with your Firebase project API Key
#define API_KEY "YOUR_FIREBASE_API_KEY"

// Replace with your Firebase Realtime Database URL
#define DATABASE_URL "YOUR_FIREBASE_DATABASE_URL"

// Define Firebase objects
FirebaseData stream;
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Variables to store sensor data
float soilMoisture1 = 0.0;
float soilMoisture2 = 0.0;

// Variable to store actuator states
bool valveOn = false;

// Flag to indicate if we are connected to Firebase
bool firebaseConnected = false;

void streamCallback(FirebaseStream data);
void streamTimeoutCallback(bool timeout);
void sendDataToFirebase();

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Assign the API key (required)
  config.api_key = API_KEY;

  // Assign the RTDB URL (required)
  config.database_url = DATABASE_URL;

  // Sign up anonymously
  config.signer.test_mode = true;

  // Assign the stream callback function
  config.stream_callback = streamCallback;

  // Assign the stream timeout callback function
  config.stream_timeout_callback = streamTimeoutCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  
  // Listen for commands
  if (!Firebase.RTDB.beginStream(&stream, "/commands")) {
    Serial.println("Can't begin stream path: /commands");
    Serial.println("REASON: " + stream.errorReason());
  }
}

void loop() {
  // Simulate sensor readings
  soilMoisture1 = random(30, 70);
  soilMoisture2 = random(40, 80);

  if (WiFi.status() == WL_CONNECTED && firebaseConnected) {
    sendDataToFirebase();
  }

  delay(5000); // Wait 5 seconds
}

void sendDataToFirebase() {
  // Sensor 1
  FirebaseJson sensor1;
  sensor1.set("name", "Sensor 1");
  sensor1.set("moistureLevel", soilMoisture1);
  if (Firebase.RTDB.setJSON(&fbdo, "/sensors/1", &sensor1)) {
    Serial.println("Sensor 1 data sent successfully");
  } else {
    Serial.println("Error sending Sensor 1 data: " + fbdo.errorReason());
  }

  // Sensor 2
  FirebaseJson sensor2;
  sensor2.set("name", "Sensor 2");
  sensor2.set("moistureLevel", soilMoisture2);
  if (Firebase.RTDB.setJSON(&fbdo, "/sensors/2", &sensor2)) {
    Serial.println("Sensor 2 data sent successfully");
  } else {
    Serial.println("Error sending Sensor 2 data: " + fbdo.errorReason());
  }
}

void streamCallback(FirebaseStream data) {
  Serial.printf("stream path, %s/%s\n", data.streamPath().c_str(), data.dataPath().c_str());
  if (data.dataType() == "boolean" && String(data.dataPath().c_str()).equals("/valve")) {
    valveOn = data.boolData();
    if(valveOn){
        Serial.println("Valve turned ON");
        // Add code here to turn on the valve
    } else {
        Serial.println("Valve turned OFF");
        // Add code here to turn off the valve
    }
  }
}

void streamTimeoutCallback(bool timeout) {
  if (timeout) {
    Serial.println("Stream timeout, resuming...");
  }
  
  if (!stream.httpConnected()) {
    Serial.printf("error code: %d, reason: %s\n\n", stream.httpCode(), stream.errorReason().c_str());
    firebaseConnected = false;
  } else {
    firebaseConnected = true;
  }
}
