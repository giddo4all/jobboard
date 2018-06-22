const MongoClient = require('mongodb').MongoClient;
var mongoUtil = require("./mongo-write.js");
var mongoURL = 'mongodb://localhost:27017/samplesite';


mongoUtil.dropTable("joblist", mongoURL);