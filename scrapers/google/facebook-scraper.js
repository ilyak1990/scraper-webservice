const cheerio = require('cheerio');
const returnedData = require('../../returned.json')
const helper = require('../../helpers/helper.js')
const initializer = require('../../helpers/initializer.js')
const urlParser = require('../../helpers/search-url-parser.js')


const faceBookUrls = [];

module.exports = {

    scrapeFaceBookFirst: async function () {

        let browser = await initializer.initializeBrowser();
        // const results = returnedData.map(async (storeJson) => {
        for (let i = 0; i < returnedData.length; i++) {
            let storeJson = returnedData[i];
            const page = await initializer.initializePage(browser);

            let escapedStore = await helper.unescapeHTML(storeJson.store)
            let url = await urlParser.createGoogleSearchUrl(escapedStore, returnedData[0].address, returnedData[0].zip)
            url = url.concat('facebook');
            console.log("finding store FB: " + escapedStore)
            //console.log("going clearinto this URL " + url + " for store " + escapedStore)

            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 120000,
            }).then(async () => {

                await page.evaluate(() => document.body.innerHTML).then(async (html) => {
                    let fbHref;
                    fbHref = await getTopResult(html);
                    faceBookUrls.push({ escapedStore, fbHref })
                    console.log(fbHref)
                })
            })
            await page.close();
        }
        console.log("done initial facebook scrape, closing browser")
        browser.close();
        return { faceBookUrls }

        async function getTopResult(html) {
            var $ = cheerio.load(html);
            let hrefArr = Array.from($('#search a', html))
            for (const href of hrefArr) {
                let currentHref = $(href).attr('href');
                if (currentHref.concat('facebook.com'))
                    return currentHref
            }
            return 'none'
        }
    }
};