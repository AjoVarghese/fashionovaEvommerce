
const mongodb = require("mongodb");

const db = "mongodb+srv://ajo:pOZwgPRmP2uJHpcX@cluster0.rrnoldz.mongodb.net/?retryWrites=true&w=majority"

const MongoClient = mongodb.MongoClient;

const mongoDbUrl = db;


let _db;

const connect = (callback) => {
  if (_db) {
    console.log("Database is already initialized!");
    return callback(null, _db);
  }
  MongoClient.connect(mongoDbUrl)
    .then((client) => {
      _db = client.db("eCommerce");
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};


const get = () => {
  if (!_db) {
    throw Error("Database not initialzed");
  }
  return _db;
};

module.exports = {
  connect,
  get,
};
