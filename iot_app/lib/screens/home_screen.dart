
import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:fl_chart/fl_chart.dart';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../services/auth_service.dart'; // Import auth service

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  late DatabaseReference _databaseReference;
  final AuthService _authService = AuthService(); // Instantiate auth service

  double _temperature = 0;
  double _humidity = 0;
  double _soilMoisture = 0;
  bool _fanOn = false;
  bool _valveOn = false;
  final List<FlSpot> _temperatureData = [];
  final List<FlSpot> _humidityData = [];
  final List<FlSpot> _soilMoistureData = [];
  String _wateringTime = "Not available";
  List<dynamic> _forecast = [];

  @override
  void initState() {
    super.initState();
    // TODO: Initialize _databaseReference with your Firebase URL
    _databaseReference = FirebaseDatabase.instance.refFromURL('YOUR_DATABASE_URL');

    _databaseReference.child('data/temperature').onValue.listen((event) {
      final data = event.snapshot.value as double? ?? 0.0;
      setState(() {
        _temperature = data;
        _temperatureData.add(FlSpot(DateTime.now().millisecondsSinceEpoch.toDouble(), data));
      });
    });

    _databaseReference.child('data/humidity').onValue.listen((event) {
      final data = event.snapshot.value as double? ?? 0.0;
      setState(() {
        _humidity = data;
        _humidityData.add(FlSpot(DateTime.now().millisecondsSinceEpoch.toDouble(), data));
      });
    });

    _databaseReference.child('data/soilMoisture').onValue.listen((event) {
      final data = event.snapshot.value as double? ?? 0.0;
      setState(() {
        _soilMoisture = data;
        _soilMoistureData.add(FlSpot(DateTime.now().millisecondsSinceEpoch.toDouble(), data));
      });
    });

    _databaseReference.child('commands/fan').onValue.listen((event) {
      final data = event.snapshot.value as bool? ?? false;
      setState(() {
        _fanOn = data;
      });
    });

    _databaseReference.child('commands/valve').onValue.listen((event) {
      final data = event.snapshot.value as bool? ?? false;
      setState(() {
        _valveOn = data;
      });
    });

    _getWateringTime();
    _getWeatherForecast();
  }

  void _toggleFan(bool value) {
    _databaseReference.child('commands/fan').set(value);
  }

  void _toggleValve(bool value) {
    _databaseReference.child('commands/valve').set(value);
  }

  void _getWateringTime() async {
    final response = await http.get(Uri.parse('https://api.mocki.io/v1/b0434569'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _wateringTime = data['time'];
      });
    } else {
      setState(() {
        _wateringTime = "Error fetching time";
      });
    }
  }

    void _getWeatherForecast() async {
    final response = await http.get(Uri.parse('https://api.mocki.io/v1/b0434569'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _forecast = data['forecast'];
      });
    } else {
      // Handle error
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Greenhouse Monitor'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await _authService.signOut();
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            // ... (All your cards and widgets will go here)
            // This part is kept the same as your original code
          ],
        ),
      ),
    );
  }
}
