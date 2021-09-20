//const puppeteer = require('puppeteer-extra');
//const cronJob = require('cron').cronJob;;
const cheerio = require('cheerio');
//const nodeMailer = require('nodemailer');
//const pretty = require('pretty-html-log').highlight;
//const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const returnedData = require('./returned.json')
const helper = require('./helper.js')
const initializer = require('./initializer.js')
const urlParser = require('./search-url-parser.js')


module.exports = {
    scrapeGoogleBusiness: async function () {
        const regularUrls = []

        let browser = await initializer.initializeBrowser();
        // const results = returnedData.map(async (storeJson) => {
        for (let i = 0; i < returnedData.length; i++) {
            let storeJson = returnedData[i];
            const page = await initializer.initializePage(browser);

            let escapedStore = await helper.unescapeHTML(storeJson.store)
            let url = await urlParser.createGoogleSearchUrl(escapedStore, returnedData[i].address, returnedData[i].zip)

            console.log("going into this URL " + url + " for store " + escapedStore)

            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 120000,
            }).then(async () => {

                await page.evaluate(() => document.body.innerHTML).then(async (html) => {
                    let businessHref;
                    businessHref = await getWebsiteButton(html);
                    businessHref = (businessHref) ? businessHref : 'unknown';
                    regularUrls.push({ escapedStore, businessHref })
                    console.log(businessHref)
                })
            })
            await page.close();
        }
        console.log("done initial google business scrape, closing browser")
        try{
        browser.close();
        }
        catch(err){
            console.log(err)
        }
        return { regularUrls }


        async function getWebsiteButton(html) {
            console.log("getting into buttton!!")
            var $ = cheerio.load(html);
            let businessButton = Array.from($("a.ab_button:contains('Website')", html))
            console.log(businessButton + " button")
            if (businessButton.length === 0) {
                console.log("NO BUTTON")
                return helper.isClosed(html)
            }
            return $(businessButton[0]).attr('href')
        }
    }
};