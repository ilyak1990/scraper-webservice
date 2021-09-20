const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const initializer = require('./initializer.js')
const fbScrape = require('./facebook-scraper.js')
const googleBusScrape = require('./google-business-scraper.js')

const helper = require('./helper.js')


puppeteer.use(StealthPlugin())

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

// async function initializeProcess() {
//     await initializer.initializeBrowser().then(async (browser) =>{
//          scrapeAllBusiness(browser)
//     })
// }
module.exports = {

    scrapeAllBusiness: async function () {
        let fbEmailArr = [];
        let businessEmailArr = [];
        let failedBusinessArr = [];
        let totalHits=0;
    //const fbLinks = await fbScrape.scrapeFaceBookFirst();
    
    const businessLinks = await googleBusScrape.scrapeGoogleBusiness();

    let browser = await initializer.initializeBrowser(); 

    await Promise.all([businessLinks])
        .then(async () => {
             running=true;
            // for (var i = 0; i < fbLinks.faceBookUrls.length; i++) {
            //     const page = await initializer.initializePage(browser);
            //     const fbLink = fbLinks.faceBookUrls[i].fbHref;
            //     console.log(fbLink)
            //     await page.goto(fbLink, {
            //         waitUntil: 'networkidle0',
            //         timeout: 120000,
            //     }).then(async () => {
            //         await page.evaluate(() => document.body.innerHTML).then(async (html) => {
            //             let returnedEmails=helper.getEmailsFromBody(fbLinks.faceBookUrls[i].escapedStore,html);
            //             console.log("returned emails " + JSON.stringify(returnedEmails))
            //             fbEmailArr.push(returnedEmails)
            //             console.log(fbEmailArr)
            //         })
            //     })
            //     await page.close();
            // }
                for (var i = 0; i < businessLinks.regularUrls.length; i++) {
                    const page = await initializer.initializePage(browser);
                    let businessLink=String(businessLinks.regularUrls[i].businessHref);
                    console.log(businessLink)
                    if(businessLink.indexOf('http')>-1)
                    {
                    await page.goto(businessLink, {
                        waitUntil: 'networkidle0',
                        timeout: 0,
                    }).then(async () => {
                        await page.evaluate(() => document.body.innerHTML).then(async (html) => {
                            let returnedEmails=helper.getEmailsFromBody(businessLinks.regularUrls[i].escapedStore,html);
                            if(returnedEmails.emailArr)
                             totalHits++;
                            businessEmailArr.push(returnedEmails)
                            console.log(helper.findContactLink(html) +  " contact link found!")
                        })
                    })
                    //console.log(businessEmailArr)
                    await page.close();
                }
                else{
                    let failedStore=businessLinks.regularUrls[i].escapedStore;
                    let link = businessLinks.regularUrls[i].businessHref
                    failedBusinessArr.push({failedStore,link})
                }
            }
            console.log("done all scraping, closing browser")
            console.log(JSON.stringify(businessEmailArr) + " final result")
            console.log("total hits " + totalHits + " " + businessEmailArr.length)
            console.log(totalHits/businessEmailArr.length*100)
            console.log(JSON.stringify(failedBusinessArr) + " failed to find href")

            await browser.close()

        }
        
        )
    // .catch(console.log("catch"))
    //await browser.close()
    return {businessEmailArr,failedBusinessArr}

}
};