var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
require('dotenv').config()
const Device = require('./device.js');

// This Dummy server was built to receive any kind of webhook or websocket
// See express.js and socket.io for more information

//#region DB config

var data_all = require("./dummy_data_all.json");
var data_device = require("./dummy_data_device.json");

let useDB = process.env.USE_DB == 'true' ? true : false;
var db;
console.log("Use database? " + useDB)

server.listen(4242);
if(useDB){
    const MongoClient = require('mongodb').MongoClient;
    var dbUrl = process.env.DB_URL
    MongoClient.connect(dbUrl, { useNewUrlParser: true}, (err, client) => {
        if (err) throw err;
        db = client.db('iot');
    });
}

//#endregion DB config

//#region CORS

/**
 * This allows Cross Origin requests
 */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

////#endregion CORS

//#region API

/*
API calls are all get, as we are only accessing data
*/

// Get data with the option of using query parameters
app.get('/api/data', (req, res) => {
    if (Object.keys(req.query).length === 0) {
      if(useDB) 
      {
        // Return data from all devices
        db.collection('data').find().toArray().then(data => {
            const metadata = { numDevices: data.length };
            res.json({ _metadata: metadata, records: data })
        }).catch(error => {
            console.log(error);
            res.status(500).json({ message: `Internal Server Error: ${error}` });
        });
      }
      else {
        const metadata = { numDevices: 3 };
        const data = data_all
        res.json({ _metadata: metadata, records: data })
      }
    }
    else {
      if(useDB){
        // Return data from a particular device and start/end time
        var dev = req.query.device;
        var dt = req.query.datatype;
        var start = new Date(req.query.start);
        var end = new Date(req.query.end);
        db.collection('data').find({'device': dev}).toArray().then(data => {
            const metadata = { numData: data.length };
            let d = data[0];
            let i = 0;
            let size = d["datatype"].length;
            var dArray = [];
            var j = 0;
            for (i = 0; i < size; i++) {
              var curDate = d["datatype"][i][dt]["time"];
              if ((curDate > start) && (curDate < end)) {
                dArray[j] = d["datatype"][i][dt];
                j++;
              }
            }
            res.json({ _metadata: metadata, records: dArray })
        }).catch(error => {
            console.log(error);
            res.status(500).json({ message: `Internal Server Error: ${error}` });
        });
      }
      else {
        const metadata = { numData: 1 };
        const data = data_device
        res.json({ _metadata: metadata, records: data })
      }
    }
});

// Get device list
app.get('/api/data/devList', (req, res) => {
  if (Object.keys(req.query).length === 0 && useDB) {
      db.collection('data').distinct("device",{},
      function(err, data) {
        if (err) throw err;
        const metadata = { numDevices: data.length };
        res.json({ _metadata: metadata, records: data })
      });
  } else {
    const metadata = { numDevices: 3};
    const data = ["device1","device2","device3"]
    res.json({ _metadata: metadata, records: data })
  }
});

// Get device map
app.get('/api/data/devMap', (req, res) => {
  if (Object.keys(req.query).length === 0 && useDB) {
      db.collection('data').distinct("config",{},
      function(err, data) {
        if (err) throw err;
        const metadata = { numDeviceMap: data.length };
        res.json({ _metadata: metadata, records: data })
      });
  } else {
    const metadata = { numDeviceMap: 3};
    const data = [{"device1":["temp","wind"],"device2":["temp","humidity"],"device3":["temp","wind","humidity"]}];
    res.json({ _metadata: metadata, records: data })
  }
});

// Get date and time; initial proof of concept function
app.get('/api/datetime', function(req, res) {
    let date = new Date();
    let time = Date.now();
    res.json({date: date, time: time});
});

// Simple endpoint of localhost:4242 - lets us know that the server is live
app.get('/', function (req, res) {
    res.send("Welcome to dummy server!");
});

//#endregion

// Websocket connection
io.on('connection', function (socket) {
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('my other event', function (data) {
        console.log(data);
    });

    // Send "telemetry" event periodically
    setInterval(function () {
        // retrieve and send most recent telemetry data
        // this will include relevant time stamp from the initial data
        socket.emit('telemetry', currentData);
    }, 100);

});

let currentData = {}

/**
 * This is in a way, faking receiving data through a websocket, all data will come through here
 * 
 * @param {*} data data in this format:
 * { device: string,
 *   data: number,
 *   date: dateTime }
 */
var receiveTelemetryData = function(data){
    //need to store data and update for websocket
    if(useDB){
        // Save values to database for historical analysis
        db.collection("data").updateOne(
          { device: data.device },
          { $addToSet: { datatype: data.datatype } }, 
          { upsert: true },
          function(err, res) {
            if (err) {
              console.log("Mongo DB update failed");
              console.log(err);
            } else {
              console.log("Updated Mongo DB");
            }
          });
    }
    /*
prototype
      "device": "device1", 
      "datatype": 
          {"temp": [
              {"time": 1550675309000, "value": 35}, 
              {"time": 1550675309600, "value": 37}], 
          "wind": [
              {"time": 1550675309000, "value": 12}]}
*/
    currentData[data.device] = data.datatype;
    console.log(currentData);
    console.log('----------------------------')
}

let newDevice1 = new Device('device1', [
    {'dataType': 'temp', 'baseValue': 75},
    {'dataType': 'wind', 'baseValue': 12},
]);
newDevice1.startTelemetry(receiveTelemetryData);

let newDevice2= new Device('device2', [
    {'dataType': 'temp', 'baseValue': 75},
    {'dataType': 'humidity', 'baseValue': 45},
]);
newDevice2.startTelemetry(receiveTelemetryData);

let newDevice3 = new Device('device3', [
    {'dataType': 'temp', 'baseValue': 75},
    {'dataType': 'wind', 'baseValue': 12},
    {'dataType': 'humidity', 'baseValue': 45},
]);
newDevice3.startTelemetry(receiveTelemetryData);