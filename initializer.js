const puppeteer = require('puppeteer-extra');
const path = require('path');

//const agent = require('random-useragent');

//let browser=null;

module.exports = {
    initializeBrowser: async function () {
        console.log("initializitng browser called")

        // if(browser!==null)
        //   {console.log("not null")
        //  return browser;
        //}
        //const userAgent = agent.getRandom();
        //const UA = userAgent || USER_AGENT;
        let pupOptions = {};
        console.log(process.env.NODE_ENV)
        console.log(__dirname + " dirname")
        // if(process.env.NODE_ENV === 'production')
        // {

        //let exec_path = path.join(__dirname + "/node_modules/puppeteer-extra/.local-chromium/win64-869685/chrome-win/chrome.exe")

        console.log("this is production")
        pupOptions = {
            headless: true,
            //executablePath: '/usr/bin/chromium-browser',
            args: [ "--no-sandbox", '--disable-web-security', '--ignore-certificate-errors']


        };
        if(process.env.NODE_ENV === 'production'){
            pupOptions.executablePath='/usr/bin/chromium-browser'
        }
        //}
        let browser = await puppeteer.launch(pupOptions)
        return await browser;
        //return browser;

    },
    initializePage: async function (browser) {
        let page = await browser.newPage()
        let width = 1920 + Math.floor(Math.random() * 100);
        let height = 3000 + Math.floor(Math.random() * 100)
        console.log(width + " by " + height)
        await page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 3000 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });
        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
        );

        //         await page.evaluateOnNewDocument(() => {
        //     Object.defineProperty(navigator, "language", {
        //         get: function() {
        //             return "en-GB";
        //         }
        //     });
        //     Object.defineProperty(navigator, "languages", {
        //         get: function() {
        //             return ["en-GB", "en"];
        //         }
        //     });
        // });
        // await page.setExtraHTTPHeaders({
        //     'Accept-Language': 'en'
        // });
        return page;
    }

};