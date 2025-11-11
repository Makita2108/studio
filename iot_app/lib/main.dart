
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:fl_chart/fl_chart.dart';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // TODO: Add your Firebase project configuration here
  // await Firebase.initializeApp(
  //   options: FirebaseOptions(
  //     apiKey: "YOUR_API_KEY",
  //     authDomain: "YOUR_AUTH_DOMAIN",
  //     databaseURL: "YOUR_DATABASE_URL",
  //     projectId: "YOUR_PROJECT_ID",
  //     storageBucket: "YOUR_STORAGE_BUCKET",
  //     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  //     appId: "YOUR_APP_ID",
  //   ),
  // );
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Greenhouse Monitor',
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
      home: LoginScreen(),
    );
  }
}

class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: Implement your login screen UI and authentication logic here
    return Scaffold(
      appBar: AppBar(
        title: Text('Login'),
      ),
      body: Center(
        child: ElevatedButton(
          child: Text('Login (dummy)'),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => MyHomePage()),
            );
          },
        ),
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  DatabaseReference _databaseReference;
  double _temperature = 0;
  double _humidity = 0;
  double _soilMoisture = 0;
  bool _fanOn = false;
  bool _valveOn = false;
  List<FlSpot> _temperatureData = [];
  List<FlSpot> _humidityData = [];
  List<FlSpot> _soilMoistureData = [];
  String _wateringTime = "Not available";
  List<dynamic> _forecast = [];

  @override
  void initState() {
    super.initState();
    _databaseReference = FirebaseDatabase.instance.refFromURL('YOUR_DATABASE_URL');

    _databaseReference.child('data/temperature').onValue.listen((event) {
      final data = event.snapshot.value as double;
      setState(() {
        _temperature = data;
        _temperatureData.add(FlSpot(DateTime.now().millisecondsSinceEpoch.toDouble(), data));
      });
    });

    _databaseReference.child('data/humidity').onValue.listen((event) {
      final data = event.snapshot.value as double;
      setState(() {
        _humidity = data;
        _humidityData.add(FlSpot(DateTime.now().millisecondsSinceEpoch.toDouble(), data));
      });
    });

    _databaseReference.child('data/soilMoisture').onValue.listen((event) {
      final data = event.snapshot.value as double;
      setState(() {
        _soilMoisture = data;
        _soilMoistureData.add(FlSpot(DateTime.now().millisecondsSinceEpoch.toDouble(), data));
      });
    });

    _databaseReference.child('commands/fan').onValue.listen((event) {
      final data = event.snapshot.value as bool;
      setState(() {
        _fanOn = data;
      });
    });

    _databaseReference.child('commands/valve').onValue.listen((event) {
      final data = event.snapshot.value as bool;
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
    //This is a mock API call, replace with your actual API endpoint
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
    //This is a mock API call, replace with your actual API endpoint
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
        title: Text('Greenhouse Monitor'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Text('Temperature', style: Theme.of(context).textTheme.headline6),
                    Text('$_temperature °C', style: Theme.of(context).textTheme.headline4),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Text('Humidity', style: Theme.of(context).textTheme.headline6),
                    Text('$_humidity %', style: Theme.of(context).textTheme.headline4),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Text('Soil Moisture', style: Theme.of(context).textTheme.headline6),
                    Text('$_soilMoisture %', style: Theme.of(context).textTheme.headline4),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Text('Fan Control', style: Theme.of(context).textTheme.headline6),
                    SwitchListTile(
                      title: Text('Fan'),
                      value: _fanOn,
                      onChanged: _toggleFan,
                    ),
                  ],
                ),
              ),
            ),
             SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Text('Watering Control', style: Theme.of(context).textTheme.headline6),
                    SwitchListTile(
                      title: Text('Water Valve'),
                      value: _valveOn,
                      onChanged: _toggleValve,
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Text('Next Recommended Watering', style: Theme.of(context).textTheme.headline6),
                    Text(_wateringTime, style: Theme.of(context).textTheme.headline5),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
             Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Text('Weather Forecast', style: Theme.of(context).textTheme.headline6),
                    SizedBox(height: 16),
                    ListView.builder(
                        shrinkWrap: true,
                        itemCount: _forecast.length,
                        itemBuilder: (context, index) {
                            final day = _forecast[index];
                            return ListTile(
                                leading: Icon(Icons.wb_sunny),
                                title: Text(day['day']),
                                subtitle: Text(day['condition']),
                                trailing: Text('${day['temp']['day']}°C'),
                            );
                        },
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Text('Temperature History', style: Theme.of(context).textTheme.headline6),
                    SizedBox(height: 16),
                    Container(
                      height: 200,
                      child: LineChart(
                        LineChartData(
                          lineBarsData: [
                            LineChartBarData(
                              spots: _temperatureData,
                              isCurved: true,
                              colors: [Colors.blue],
                              barWidth: 4,
                              isStrokeCapRound: true,
                              belowBarData: BarAreaData(show: false),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Text('Humidity History', style: Theme.of(context).textTheme.headline6),
                    SizedBox(height: 16),
                    Container(
                      height: 200,
                      child: LineChart(
                        LineChartData(
                          lineBarsData: [
                            LineChartBarData(
                              spots: _humidityData,
                              isCurved: true,
                              colors: [Colors.red],
                              barWidth: 4,
                              isStrokeCapRound: true,
                              belowBarData: BarAreaData(show: false),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: <Widget>[
                    Text('Soil Moisture History', style: Theme.of(context).textTheme.headline6),
                    SizedBox(height: 16),
                    Container(
                      height: 200,
                      child: LineChart(
                        LineChartData(
                          lineBarsData: [
                            LineChartBarData(
                              spots: _soilMoistureData,
                              isCurved: true,
                              colors: [Colors.brown],
                              barWidth: 4,
                              isStrokeCapRound: true,
                              belowBarData: BarAreaData(show: false),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
