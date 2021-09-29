var express = require('express');
var router = express.Router();
const google = require('../scrapers/google/google.js')

module.exports = function (io) {

    let running = false;
    //need to fix here, when this is called in controller there is an async issue where the model is undefined, if you put the same logic in there it works fine
    router.get('/', async (req, res) => {
        console.log("is running")
      //  if(running===true){return  res.status(400).json("this batch is currently running") }
    //    running = true;
    
        //if (running !== true) {
          //  running = true;
            // await google.scrapeAllBusiness().then((returned) => {
            //     console.log(JSON.stringify(returned) + " RETURNED IN ROUTER.JS")
            //     //res.render('results',{successStores:returned.businessEmailArr,failedStores:returned.failedBusinessArr})
            //     res.status(200).json(returned);
            //     //return res;

            // On every Client Connection
            // io.on('connection', async socket => {
            //     console.log("connection works")
            //     socket.on("google-socket", async docId => {
            //         console.log("in google socket")
            //         try{
            //         await google.scrapeAllBusiness().then((returned) => {
            //             console.log(JSON.stringify(returned) + " RETURNED IN ROUTER.JS")
            //             socket.emit("google-socket", returned);
            //             running = false;
            //             return res.status(200).json(returned);
            //         })
            //     }
            //     catch(err){
            //         console.log("router level catch " + err)
            //         socket.emit("google-socket", err);
            //         return res.status(500).json(err);

            //     }

            //     });
            // });
            try{
                    await google.scrapeAllBusiness().then((returned) => {
                        console.log(JSON.stringify(returned) + " RETURNED IN ROUTER.JS")
                        //socket.emit("google-socket", returned);
                        running = false;
                        return res.status(200).json(returned);
                    })
                }
                catch(err){
                    console.log("router level catch " + err)
                    //socket.emit("google-socket", err);
                    return res.status(500).json(err);

                }
            return res;
        //}
    })
    return router;
}
//module.exports = router;