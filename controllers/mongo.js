const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://dbuser:6mMGv2eYd8jYBkhQ@6c1o3.mongodb.net/babershop?retryWrites=true&w=majority";
const dbName = "babershop";
let _db;

module.exports = {

    connect: function (callback) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
            _db = client.db(dbName);
            return callback(err, _db);
        });
    },

    getDb: function () {
        return _db;
    }
};
