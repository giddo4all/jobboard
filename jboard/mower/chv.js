var request = require("request");
var cheerio = require("cheerio");
var mongodb = require('mongodb');
var mongoUtil = require("./mongo-write.js");


var url = "https://jobs.chevron.com/search/?q=&locationsearch=Nigeria";
var urlPrefix = "https://jobs.chevron.com";
const mongoURL = mongoUtil.mongoURL;
const tableName = mongoUtil.tableName;
const chevronLogo = "/images/chevron-logo.png";


request(url, function (err, response, html) {
	if (!err) {
		var $ = cheerio.load(html);
		// var allJobs = ($("#searchResultsShell").children().find('a[href*="/job/"]'))
		var allJobs = ($('a[href^="/job/"]'))
		//console.log(allJobs.toString());
		var jobIndex = allJobs.length - 1;
		console.log(jobIndex);
		createData(allJobs, function result(jobs) {
			if (jobs.length > 0) {
				mongoUtil.dbstore(tableName, jobs, mongoURL);
			} else {
				console.log("No Job matching the provided DOM criteria");
			}
		});
	}
});

function createData(htmlData, cb) {
	let wheat = [];
	htmlData.each(function (jobIndex) {
		console.log("Index is: " + jobIndex);
		let eachJob = htmlData.eq(jobIndex)
		let jobTitle = eachJob.text();
		let jobUrl = urlPrefix + eachJob.attr('href');
		let jobData = { title: jobTitle, company: "Chevron", location: "Nigeria", joburl: jobUrl, image: chevronLogo, tags: [] };
		if (jobUrl.search("/job/NG") != -1 || jobUrl.search("/job/Nigeria") != -1) {
			wheat.push(jobData);
		}
	});
	cb(wheat);
}
