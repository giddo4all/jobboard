const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/samplesite';
const tableName = "joblist";

function dbwrite(collectionName, data, mongoURL) {
  let collectionObject;
  let dbConnectObj;
  dbConnect(mongoURL)
    .then((db) => {
      dbConnectObj = db;
      let collectionObj = db.collection(collectionName);
      collectionObject = collectionObj;
      return insertData(collectionObj, data);
    })
    .then((value) => {
      return closeConnection(dbConnectObj);
    })
    .catch((error) => {
      console.log(error);
    })
}


let dbConnect = function (mongoURL) {
  return new Promise(function (resolve, reject) {
    let dbConnectObj;
    MongoClient.connect(mongoURL, function (error, db) {
      if (!error) {
        console.log('Connected to Server');
        resolve(db);
      } else {
        console.log('Unable to connect to the Server:', error);
        reject(error);
      }
    });
  });
}


let clearTable = function (dbConnectObj, collectionName) {
  return new Promise(function (resolve, reject) {
    let collectionObj = dbConnectObj.collection(collectionName);
    console.log("Cleaning Table");
    collectionObj.remove({});
    console.log("Table Dropped");
    resolve();
  });
}


function dropTable(collectionName, mongoURL) {
  let collectionObject;
  let dbConnectObj;
  try {
    dbConnect(mongoURL)
      .then((db) => {
        dbConnectObj = db;
        return clearTable(dbConnectObj, collectionName);
      })
      .then(function () {
        return closeConnection(dbConnectObj);
      })
      .catch((error) => {
        console.log(error);
        // reject(error);
      })
  } catch (err) {
    console.log(err);
  }
}


let insertData = function (collectionObj, value) {
  return new Promise(function (resolve, reject) {
    collectionObj.insertMany(value, { w: 1 }, function (error, result) {
      if (!error) {
        console.log(result);
        resolve(result);
      } else {
        console.log(error);
        reject(error);
      }
    });
  });
}





let closeConnection = function (dbConnection) {
  console.log("Closing DB Connection");
  return new Promise(function (resolve, reject) {
    dbConnection.close();
    // resolve("DB Connection is closed");
    //resolve();
  });
}


exports.tableName = tableName;
exports.mongoURL = mongoURL;
exports.dropTable = dropTable;
exports.dbstore = dbwrite;
