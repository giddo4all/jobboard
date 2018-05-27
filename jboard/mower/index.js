var request = require("request");
var cheerio = require("cheerio");
var mongodb = require('mongodb');


var url ="https://careers.mtnonline.com/Vacancy.aspx";
var urlPrefix ="https://careers.mtnonline.com/";
var MongoClient = mongodb.MongoClient;

var mongoURL = 'mongodb://localhost:27017/samplesite';
// var url ="https://www.reddit.com/top/"
request(url, function(err, response, html) {
	if (!err){
		var $ = cheerio.load(html);
		// var allJobs = $("#ctl00_cphBody_divVacancies").children().html();
		// console.log(allJobs);
		var allJobs = ($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]'))
		// var jobIndex = ($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]').length) -1;
		var jobIndex = allJobs.length -1;
		// console.log($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]').attr())
		console.log(jobIndex);

		    	// Connect to the server
    	MongoClient.connect(mongoURL, function(err, db){
      	if (err) {
        	console.log('Unable to connect to the Server:', err);

      	} else {
      	     	console.log('Connected to Server');
        	        // Get the documents collection
        var collection = db.collection('joblist');

		var jobs = [];
		allJobs.each(function(jobIndex) {
			// console.log($("#ctl00_cphBody_divVacancies").children().find('a[href*="VacancyDetails"]').eq(jobIndex).text());
			var eachJob = allJobs.eq(jobIndex)
			var jobTitle = eachJob.text();
			var jobUrl = urlPrefix + eachJob.attr('href');
        var jobData = {title: jobTitle, company: "MTN Nigeria", joburl: jobUrl};

        // Insert the student data into the database
        collection.insert([jobData], function (err, result){
          if (err) {
            console.log(err);
          } else {
			console.log(result)

		}

		  // // Close the database
          db.close();
 		 });
		// 		allJobs.each(function(index) {
		// 	jobs.push($("#ctl00_cphBody_divVacancies").children().eq(2).find('a[href^="VacancyDetails"]:first').text())
	});

	}

		  // // // Close the database
    //       db.close();

});

}
    	// Close the database
          // db.close();
});