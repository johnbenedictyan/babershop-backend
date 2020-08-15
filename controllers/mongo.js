const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_DB_URL;
const dbName = "babershop";
let _db;

module.exports = {

    connect: function (callback) {
        MongoClient.connect(
            url,
            { useUnifiedTopology: true },
            (err, client) => {
                _db = client.db(dbName);
                return callback(err, _db);
            }
        );
    },

    getDb: function () {
        return _db;
    }
};
