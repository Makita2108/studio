
# Greenhouse Monitoring System

This project is an IoT solution for monitoring and controlling a greenhouse environment using an ESP32 microcontroller and a Flutter application. The system provides real-time data on temperature, humidity, and soil moisture, and allows for remote control of a fan and a watering valve.

## Features

- **Real-time Monitoring**: Track temperature, humidity, and soil moisture levels in real-time.
- **Remote Control**: Control a fan and a watering valve remotely through the Flutter app.
- **Data History**: Visualize historical sensor data with interactive charts.
- **Smart Watering**: Get recommendations for the next watering time based on a mock weather API.
- **Weather Forecast**: View a weather forecast to help you plan your greenhouse management.
- **Offline Caching**: The ESP32 caches sensor data when offline and sends it to Firebase once reconnected.

## Technologies Used

- **Hardware**: ESP32
- **Firmware**: C++ with PlatformIO and the Arduino framework
- **Backend**: Firebase Realtime Database
- **Mobile App**: Flutter
- **Cloud Services**: Mock weather API for watering recommendations and weather forecasts

## Setup and Installation

### ESP32

1.  **Open the Project**: Open the `esp32_greenhouse` directory in Visual Studio Code with the PlatformIO extension installed.
2.  **Configure Credentials**: In `src/esp32_main.cpp`, replace the placeholder values for `WIFI_SSID`, `WIFI_PASSWORD`, `API_KEY`, and `DATABASE_URL` with your Wi-Fi and Firebase project credentials.
3.  **Build and Upload**: Build the project and upload the firmware to your ESP32.

### Flutter App

1.  **Open the Project**: Open the `iot_app` directory in your preferred IDE (e.g., VS Code, Android Studio).
2.  **Configure Firebase**: In `lib/main.dart`, uncomment the `Firebase.initializeApp` block and add your Firebase project configuration.
3.  **Get Dependencies**: Run `flutter pub get` in the `iot_app` directory to install the required packages.
4.  **Run the App**: Run the application on an emulator or a physical device.

## Usage

Once the ESP32 is running and the Flutter app is installed, the system will work as follows:

- The ESP32 will automatically begin reading sensor data and sending it to your Firebase Realtime Database.
- The Flutter app will display the sensor data in real-time on the dashboard.
- You can use the switches in the app to remotely control the fan and the water valve.
- The app will also display the next recommended watering time and a weather forecast based on the mock API.
