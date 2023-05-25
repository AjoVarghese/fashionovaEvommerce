
// const mongodb = require("mongodb");

// const db = "mongodb+srv://ajo:pOZwgPRmP2uJHpcX@cluster0.rrnoldz.mongodb.net/?retryWrites=true&w=majority"


// const MongoClient = mongodb.MongoClient;

// const mongoDbUrl = db;


// let _db;

// const connect = (callback) => {
//   if (_db) {
//     console.log("Database is already initialized!");
//     return callback(null, _db);
//   }
//   MongoClient.connect(mongoDbUrl)
//     .then((client) => {
//       _db = client.db("eCommerce");
//       callback(null, _db);
//     })
//     .catch((err) => {
//       callback(err);
//     });
// };


// const get = () => {
//   if (!_db) {
//     throw Error("Database not initialzed");
//   }
//   return _db;
// };

// module.exports = {
//   connect,
//   get,
// };
const MongoClient = require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect = function (done){
    const url = "mongodb://0.0.0.0:27017/"
    const dbname = 'eCommerce'

    MongoClient.connect(url,(err,data)=>{
        if(err) return done (err)
        state.db = data.db(dbname)

    })

    done()
}

module.exports.get=function (){
    return state.db
}