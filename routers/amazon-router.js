// var express = require('express');
// var router = express.Router();
// const amazon = require('../scrapers/amazon/amazon.js')

// module.exports = function (io) {

//     let running = false;
//     //need to fix here, when this is called in controller there is an async issue where the model is undefined, if you put the same logic in there it works fine
//     router.get('/', async (req, res) => {
//         console.log("is running")
   
//                     try{
//                     await google.scrapeAllBusiness().then((returned) => {
//                         console.log(JSON.stringify(returned) + " RETURNED IN ROUTER.JS")
//                         socket.emit("google-socket", returned);
//                         running = false;
//                         return res.status(200).json(returned);
//                     })
//                 }
//                 catch(err){
//                     console.log("router level catch " + err)
//                     socket.emit("google-socket", err);
//                     return res.status(500).json(err);

//                 }

     
//             return res;
//     })
//     return router;
// }
// //module.exports = router;