//const puppeteer = require('puppeteer-extra');
//const cronJob = require('cron').cronJob;;
const cheerio = require('cheerio');
//const nodeMailer = require('nodemailer');
//const pretty = require('pretty-html-log').highlight;
//const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const returnedData = require('../../returned.json')
const helper = require('../../helpers/helper.js')
const initializer = require('../../helpers/initializer.js')
const urlParser = require('../../helpers/search-url-parser.js')
const proxyRequest = require('puppeteer-proxy')



module.exports = {
    scrapeGoogleBusiness: async function () {
        const regularUrls = []
        const erroredUrls = []
        let browser = await initializer.initializeBrowser();
        // const results = returnedData.map(async (storeJson) => {
        for (let i = 0; i < returnedData.length; i++) {
            let storeJson = returnedData[i];
            const page = await initializer.initializePage(browser);
        
            
            let escapedStore = await helper.unescapeHTML(storeJson.store)
            let googleSearch = await urlParser.createGoogleSearchUrl(escapedStore, returnedData[i].address, returnedData[i].zip)

            console.log("------------------ " + googleSearch + " for store " + escapedStore + " ------------------")
            try {
                // await page.setRequestInterception(true);

                // page.on('request', async (request) => {
                //   await proxyRequest({
                //     page,
                //     proxyUrl: 'https://20.88.192.37	:80',
                //     request,
                //   });
                // });
              
                await page.goto(googleSearch, {
                    waitUntil: 'networkidle0',
                    timeout: 0,
                }).then(async () => {
                    //await page.screenshot({ path: "./screenshot.png", fullPage: true });
                    await page.evaluate(() => document.body.innerHTML).then(async (html) => {
                        let businessHref;
                        businessHref = await getWebsiteButton(html,page);
                        businessHref = (businessHref) ? businessHref : 'unknown';
                        regularUrls.push({ escapedStore, businessHref, googleSearch })
                        console.log(businessHref + " <<<business site  result")
                    })
                })
            }
            catch (err) {
                console.log("google-business-scraper level catch")
                let erroredStore = "errored-" + escapedStore;
                erroredUrls.push({ erroredStore, businessHref })
            }
            finally {
                regularUrls.concat(erroredUrls)
                await page.close();
            }
        }
        console.log("done initial google business scrape, closing browser")
        try {
            browser.close();
        }
        catch (err) {
            console.log(err)
        }
        return { regularUrls }


        async function getWebsiteButton(html,page) {
            let result = 'couldnt find website on google search';
            try {
                var $ = cheerio.load(html);
                let businessButton = Array.from($("a.ab_button:contains('Website')", html))
                if (businessButton.length === 0) {
                   // await page.screenshot({ path: "./screenshot.png", fullPage: true });
                    result = helper.isClosed(html)
                }
                else{
                result = $(businessButton[0]).attr('href')
                }
            }
            catch (err) {
                console.log("google-business-scraper level scraper")
                result = err
            }
            finally { return result; }
        }

    }
};