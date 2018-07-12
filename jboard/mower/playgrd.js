var request = require("request");
var cheerio = require("cheerio");
var mongodb = require('mongodb');
var mongoUtil = require("./mongo-write.js");
const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
var fs = require('fs');
var chAdv = require('cheerio-advanced-selectors')

// const $ = cheerio.load('<ul id = "fruits"><li class="apple">Apple</li><li class="apple">Orange</li><li class="apple">Pear</li></ul>');
// const $ = cheerio.load('< div class="accordion data-accordion" id = "ge-accordion-" > <div class="accordion-group"><div class="accordion-heading inline"> <a class="accordion-toggle pull-right collapsed" data-toggle="collapse" data-parent="#ge-accordion-" href="#job18356713950" id="link18356713950"><span class="out">Graduate Internship Program (GIP), PRC<i class="geui-icon geui-icon-blue geui-icon-plus"></i></span><span class="in">Graduate Internship Program (GIP), PRC<i class="geui-icon geui-icon-blue geui-icon-minus"></i></span></a></div></div>');
// var aj = $('div')
// console.log(aj.length);
// console.log(aj.eq(1).attr('class'));
// console.log(cheerio.load('<ul id = "fruits"><li class="ap ple">Apple</li><li class="orange">Orange</li><li class="pear">Pear</li></ul>').html().toString());
// var aj = $('li[class="apple"]')


function bufferFile(relPath) {
    var path = require('path');
    return fs.readFileSync(path.join(__dirname, relPath));
}

var BUFFER = bufferFile('./test.html');
// console.log(cheerio.load(BUFFER).html().toString());
var $ = cheerio.load(BUFFER);
$('div[class="span5 title"]').each(function (id, value) {
    // var tt = allJobs.eq(0).attr('id');
    // console.log($(this).find('div[class=span10]').first().text() + " %%%%%%%%");
    // console.log($(this).find('a[class^="geui-button2 blue"]').attr('href') + " %%%%%%%%");
    let jobTitle = $(this).find('span[class=out]').text()
    let companyName = $(this).find('div[class=span10]').first().text();
    let locationName = $(this).find('div[class="span3 hidden-phone"]').text();
    let jobUrl = $(this).find('a[class^="geui-button2 blue"]').attr('href');
    let jobData = { title: jobTitle, company: companyName, location: locationName, joburl: jobUrl, image: "/images/ge-logo.png", tags: [] };

    console.log(jobData);
});
// var tt = allJobs.eq(0).text(); //working piece
// var tt = allJobs.eq(0).attr('id');
// var $tt = cheerio.load(allJobs.eq(0));
// console.log(chAdv.find($tt, 'span'));
// console.log(tt);//.toString());
// console.log(tt.attr('href'));
// console.log(tt.toString());