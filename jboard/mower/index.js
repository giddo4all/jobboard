var request = require("request");
var cheerio = require("cheerio");
var mongodb = require('mongodb');
var mongoUtil = require("./mongo-write.js");


// var url ="https://careers.mtnonline.com/Vacancy.aspx";
// var urlPrefix ="https://careers.mtnonline.com/";
// var MongoClient = mongodb.MongoClient;
// var mongoURL = 'mongodb://localhost:27017/samplesite';
// // var url ="https://www.reddit.com/top/"
// request(url, function(err, response, html) {
// 	if (!err){
// 		var $ = cheerio.load(html);
// 		// var allJobs = $("#ctl00_cphBody_divVacancies").children().html();
// 		// console.log(allJobs);
// 		var allJobs = ($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]'))
// 		// var jobIndex = ($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]').length) -1;
// 		var jobIndex = allJobs.length -1;
// 		// console.log($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]').attr())
// 		console.log(jobIndex);

// 		    	// Connect to the server
//     	MongoClient.connect(mongoURL, function(err, db){
//       	if (err) {
//         	console.log('Unable to connect to the Server:', err);

//       	} else {
//       	     	console.log('Connected to Server');
//         	        // Get the documents collection
//         var collection = db.collection('joblist');

// 		var jobs = [];
// 		allJobs.each(function(jobIndex) {
// 			// console.log($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]').eq(jobIndex).text());
// 		var eachJob = allJobs.eq(jobIndex)
// 		var jobTitle = eachJob.text();
// 		var jobUrl = urlPrefix + eachJob.attr('href');
//         var jobData = {title: jobTitle, company: "MTN Nigeria", joburl: jobUrl};

//         // Insert the student data into the database
//         collection.insert([jobData], function (err, result){
//           if (err) {
//             console.log(err);
//           } else {
// 			console.log(result)
// 		}

//           db.close();
//  		 });
// 		// 		allJobs.each(function(index) {
// 		// 	jobs.push($("#ctl00_cphBody_divVacancies").children().eq(2).find('a[href^="VacancyDetails"]:first').text())
// 	});

// 	}


// });

// }

// });




// var data;
// mtnjob(function dbInsert(mongoURL, data){
// 	console.log(data);
// 	data = mydata
// });


// console.log(data);

// dbInsert(mongoURL, data, function(err){
// 	if (err) {
// 		console.log('There was error inserting data into database:', err);
// 	} 
// });


// mtnjob()


// function mtnjob() {
// 	let url ="https://careers.mtnonline.com/Vacancy.aspx";
// 	let urlPrefix ="https://careers.mtnonline.com/";
// 	var jobData;
// 	request(url, function(err, response, html) {
// 	if (err){
// 		console.log('Error occurred while getting job info:', err);
// 	} else {
//         var $ = cheerio.load(html);
// 		var allJobs = ($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]'))
// 		var jobIndex = allJobs.length -1;
// 		console.log(jobIndex);
// 		let jobs = [];
// 		allJobs.each(jobIndex, function(jobData) {
// 		let eachJob = allJobs.eq(jobIndex)
// 		let jobTitle = eachJob.text();
// 		let jobUrl = urlPrefix + eachJob.attr('href');
//         jobData = {title: jobTitle, company: "MTN Nigeria", joburl: jobUrl};
//         // cb(jobData);
//     });
//     }
// }, dbInsert(mongoURL, jobData));
// //return jobData
// }

// function dbInsert(dbURL, jobDataJSON) {
// 	let MongoClient = mongodb.MongoClient;
// 	MongoClient.connect(dbURL, function(err, db){
//       	if (err) {
//         	console.log('Unable to connect to the Server:', err);
//       	} else {
//       		console.log('Connected to Server');
//         	var collection = db.collection('joblist');
//         	collection.insert([jobDataJSON], function (err, result){
//           	if (err) {
//             	console.log(err);
//          	} else {
// 				console.log(result);
// 			}

//           	db.close();
//  		 });

// 		}
// 	});
// }






var url ="https://careers.mtnonline.com/Vacancy.aspx";
var urlPrefix ="https://careers.mtnonline.com/";
var mongoURL = 'mongodb://localhost:27017/samplesite';
// var mongoURL = 'mongodb://localhost:27017/jobber';
// var jobs = [];
// request(url, function(err, response, html) {
// 	if (!err){
// 		var $ = cheerio.load(html);
// 		var allJobs = ($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]'))
// 		console.log(allJobs);
// 		var jobIndex = allJobs.length -1;
// 		console.log(jobIndex);

// 		if(jobIndex >= 0){
// 			allJobs.each(function(jobIndex) {
// 				console.log("Index is: " + jobIndex);
// 			let eachJob = allJobs.eq(jobIndex)
// 			let jobTitle = eachJob.text();
// 			let jobUrl = urlPrefix + eachJob.attr('href');
//         	let jobData = {title: jobTitle, company: "MTN Nigeria", joburl: jobUrl};
//         	jobs.push(jobData);
//         	mongoUtil.dbstore(mongoURL, jobs, function(err, db){
//         		db.close();
//         	});
//         	// console.log(jobs);
// 			});
// 		}
// 	}
// // return (jobs)
// // console.log(jobs);
// });

request(url, function(err, response, html) {
	if (!err){
		var $ = cheerio.load(html);
		var allJobs = ($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]'))
		// console.log(allJobs);
		var jobIndex = allJobs.length -1;
		console.log(jobIndex);

		if(jobIndex >= 0){
			createData(allJobs, function result(jobs) {
				// console.log(jobs);
        	mongoUtil.dbstore("joblist", jobs, mongoURL);

			});
		} else {
			console.log("No Job matching the provided DOM criteria");
		}
	}

});

function createData(htmlData, cb) {
	let wheat =[];
	htmlData.each(function(jobIndex) {
	console.log("Index is: " + jobIndex);
	let eachJob = htmlData.eq(jobIndex)
	let jobTitle = eachJob.text();
	let jobUrl = urlPrefix + eachJob.attr('href');
    let jobData = {title: jobTitle, company: "MTN Nigeria", joburl: jobUrl, image: "/images/mtn-logo.jpg"};
    wheat.push(jobData);
	});
 	cb(wheat);
}

// console.log(jobs);

// var tyt = jobs;
// console.log(tyt);

//     	MongoClient.connect(mongoURL, tyt, function(err, db){
//       	if (err) {
//         	console.log('Unable to connect to the Server:', err);
//       	} else {
//       	    console.log('Connected to Server');
//       	    var collection = db.collection('joblist');
//       	            // Insert the student data into the database
//       	    tyt.forEach(function(idex) {
//         	collection.insert([tyt.eq(idex)], function (err, result){
//         		console.log(tyt.eq(idex));
//           	if (err) {
//             	console.log(err);
//           	} else {
// 				console.log(result);
// 			}

//  		 	});
//         });

//     }

//     db.close();
// });