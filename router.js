var express = require('express');
var router = express.Router();
const archer = require('./archer.js')

module.exports = function (io) {

    let running = false;
    //need to fix here, when this is called in controller there is an async issue where the model is undefined, if you put the same logic in there it works fine
    router.get('/', async (req, res) => {
        console.log("is running")
        if(running===true){return  res.status(400).json("this batch is currently running") }
        running = true;
        //if (running !== true) {
          //  running = true;
            // await archer.scrapeAllBusiness().then((returned) => {
            //     console.log(JSON.stringify(returned) + " RETURNED IN ROUTER.JS")
            //     //res.render('results',{successStores:returned.businessEmailArr,failedStores:returned.failedBusinessArr})
            //     res.status(200).json(returned);
            //     //return res;

            // On every Client Connection
            io.on('connection', async socket => {
                console.log("connection works")
                socket.on("archer-socket", async docId => {
                    console.log("in archer socket")
                    await archer.scrapeAllBusiness().then((returned) => {
                        console.log(JSON.stringify(returned) + " RETURNED IN ROUTER.JS")
                        socket.emit("archer-socket", returned);
                        running = false;
                        return res.status(200).json(returned);
                    })

                });
            });
            await archer.scrapeAllBusiness().then((returned) => {
                console.log(JSON.stringify(returned) + " RETURNED IN ROUTER.JS")
                running = false;
                return res.status(200).json(returned);
            })

            // })
            return res;
        //}
    })
    return router;
}
//module.exports = router;