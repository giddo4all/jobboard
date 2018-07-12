const request = require("request");
const cheerio = require("cheerio");
const mongodb = require('mongodb');
const mongoUtil = require("./mongo-write.js");


const url = "https://careers.mtnonline.com/Vacancy.aspx";
const urlPrefix = "https://careers.mtnonline.com/";
const mongoURL = mongoUtil.mongoURL;
const tableName = mongoUtil.tableName;
const mtnLogo = "/images/mtn-logo.jpg";


request(url, function (err, response, html) {
	if (!err) {
		var $ = cheerio.load(html);
		var allJobs = ($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]'))
		var jobIndex = allJobs.length - 1;
		console.log(jobIndex);
		if (jobIndex >= 0) {
			createData(allJobs, function result(jobs) {
				mongoUtil.dbstore(tableName, jobs, mongoURL);
			});
		} else {
			console.log("No Job matching the provided DOM criteria");
		}
	}
});

function createData(htmlData, cb) {
	let wheat = [];
	htmlData.each(function (jobIndex) {
		console.log("Index is: " + jobIndex);
		let eachJob = htmlData.eq(jobIndex)
		let jobTitle = eachJob.text();
		let jobUrl = urlPrefix + eachJob.attr('href');
		let jobData = { title: jobTitle, company: "MTN", location: "Nigeria", joburl: jobUrl, image: mtnLogo, tags: [] };
		wheat.push(jobData);
	});
	cb(wheat);
}
