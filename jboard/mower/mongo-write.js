var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// function dbwrite(mongoURL, tyt) {

//   MongoClient.connect(mongoURL, function(err, db){
//   if (err) {
//     console.log('Unable to connect to the Server:', err);
//   } else {
//     console.log('Connected to Server');
//     var collection = db.collection('joblist');
//       	            // Insert the student data into the database
//     tyt.forEach(function(value) {
//           console.log("value is: " + value.toString());
//     collection.insert(value, function (err, result){
//     if (err) {
//        	console.log(err);
//     } else {
// 			console.log(result);
// 		}
//  		});
//         // db.close();
//     });

//     }
// // db.close();
// });

// }



function dbwrite(collectionObj, data, mongoURL) {
  MongoClient.connect(mongoURL, function(error, db){
   storeData(error, db, collectionObj, data)
  });
}




function storeData(error, dbConnectObj, collectionName, dataJSON){
  if (error) {
    console.log('Unable to connect to the Server:', error);
  } else {
    console.log('Connected to Server');
    var collection = dbConnectObj.collection(collectionName);
    dataJSON.forEach(function(value, index) {
    console.log("value is: " + value.toString());

    collection.insert(value, function logResult (error, result){
    if (error) {
        console.log(error);
    } else {
      console.log(result);
      if(index+1 >= dataJSON.length){
        dbConnectObj.close();
      }
    }

  });
        
    });

  }
}

function closeConnection() {
  // dbConnection.close()
  console.log("To close Connection Here");
}



exports.dbstore = dbwrite;