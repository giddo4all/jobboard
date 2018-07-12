const request = require("request");
const cheerio = require("cheerio");
const mongodb = require('mongodb');
const mongoUtil = require("./mongo-write.js");
const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');




const urlGE = "https://www.ge.com/africa/careers/opportunities?keyword=&country=Nigeria&state=TG_SEARCH_ALL&func=TG_SEARCH_ALL&business=TG_SEARCH_ALL&experience_level=TG_SEARCH_ALL";
const mongoURL = mongoUtil.mongoURL;
const tableName = mongoUtil.tableName;
const geLogo = "/images/ge-logo.png";


(async function () {
    async function launchChrome() {
        return await chromeLauncher.launch({
            chromeFlags: [
                '--disable-gpu',
                '--headless'
            ]
        });
    }
    const chrome = await launchChrome();
    const protocol = await CDP({
        port: chrome.port
    });

    // ALL FOLLOWING CODE SNIPPETS HERE
    const {
        DOM,
        Page,
        Emulation,
        Runtime
    } = protocol;
    await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()]);
    Page.navigate({
        url: urlGE
    });
    Page.loadEventFired(async () => {
        const script1 = "document.querySelector('#job_search_results').outerHTML"
        // Evaluate script1
        const result = await Runtime.evaluate({
            expression: script1
        });
        // writeToFile(result.result.value, console.log("DONE Getting Job DOM"));
        parseDOM(result.result.value, console.log("DONE Getting Job DOM"))
        protocol.close();
        chrome.kill();
    });
})();


function parseDOM(dom, cb) {
    let $ = cheerio.load(dom);
    createData($, function result(jobs) {
        if (jobs.length > 0) {
            mongoUtil.dbstore(tableName, jobs, mongoURL);
        } else {
            console.log("No Job matching the provided DOM criteria");
        }
    });
    cb;
}

function createData($, cb) {
    let wheat = [];
    $('div[class="span5 title"]').each(function (id, value) {
        let jobTitle = $(this).find('span[class=out]').text()
        let companyName = $(this).find('div[class=span10]').first().text();
        let locationName = $(this).find('div[class="span3 hidden-phone"]').text();
        let jobUrl = $(this).find('a[class^="geui-button2 blue"]').attr('href');
        let jobData = { title: jobTitle, company: companyName, location: locationName, joburl: jobUrl, image: geLogo, tags: [] };
        wheat.push(jobData)
    });
    cb(wheat);
}
