db = new Mongo().getDB('iot');

// Remove all data from Mongo IoT Database
db.data.remove({});
