# Dummy Server
This is a dummy server to create fake endpoints for the simulation of data

## Environment
the .env file contains some parameters for running this server.

default is 
```
DB_URL=mongodb://localhost:27017
USE_DB=false
```

`useDB` set to false ensures the generated data will not be saved and for the api calls dummy data will be read in from the json files and not be generated dynamically.  if `useDB` is true it will attempt to connect to a MongoDB instance using the `DB_URL` value.

## Mongo DB

To use Mongo DB, first install it and then run `mongod` as a service.  As a one-time configuration, run `mongo` from the terminal.  Next enter `use iot` to have the database name be called iot.  For quick retrieval, add a configuration entry of the locations and sources being used.  For example, this test server used
```
db.data.insertOne({config: {device1: ["temp", "wind"], device2: ["temp", "humidity"], device3: ["temp", "wind", "humidity"]}})
```
If you wish to remove ALL data from the database and restart it completely run
```
mongo clear.mongo.js
```
from a terminal.  Note that the js file is located within this backend directory.
