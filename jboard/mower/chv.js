var request = require("request");
var cheerio = require("cheerio");
var mongodb = require('mongodb');
var mongoUtil = require("./mongo-write.js");


var url ="https://jobs.chevron.com/search/?q=&locationsearch=nigeria";
var urlPrefix ="https://jobs.chevron.com";
var mongoURL = 'mongodb://localhost:27017/samplesite';
// var mongoURL = 'mongodb://localhost:27017/jobber';



request(url, function(err, response, html) {
	if (!err){
		var $ = cheerio.load(html);
		// var allJobs = ($("#searchResultsShell").children().find('a[href*="/job/"]'))
		var allJobs = ($('a[href^="/job/"]'))
		// $("a[href*='/test/']")
		console.log(allJobs.toString());
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
    let jobData = {title: jobTitle, company: "Chevron Nigeria", joburl: jobUrl, image: "/images/chevron-logo.png"};
    wheat.push(jobData);
	});
 	cb(wheat);
}
