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
        let pupOptions={}; 
        console.log(process.env.NODE_ENV)
        if(process.env.NODE_ENV === 'production')
        {console.log("this is production")
             pupOptions={
                executablePath: '/usr/bin/chromium-browser',
                args: ["--no-sandbox"]
              };
        }
        return await puppeteer.launch(pupOptions)
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
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en'
        });
        return page;
    }

};