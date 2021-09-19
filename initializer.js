const puppeteer = require('puppeteer-extra');
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
        return await puppeteer.launch()
        //return browser;
        
    },
    initializePage: async function (browser) {
        let page = await browser.newPage()
        await page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 3000 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });
        return page;
    }

};