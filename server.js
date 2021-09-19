var express = require('express');
var path = require('path');
var cors = require('cors');
var app = express();

__basePath = __dirname;
const port = 3000

app.get('/',(req,res)=>{
    //res.render('home',{name:'bob'})
    res.send('test')
})

app.get('/test',(req,res)=>{
  //res.render('home',{name:'bob'})
  res.send('test')
})

const server = app.listen(port,()=>{
console.log(`Server running on ${port}`)
})

options={
  cors:true,
  origins:["http://localhost:4200"],
 }
const io = require('socket.io')(server,options);
const routerJs = require('./router')(io)
app.use('/archer', routerJs);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

let whitelist = ['http://localhost:4200']

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    if (!origin) return callback(null, true);
    console.log(origin + " origin coming in")
    if (whitelist.indexOf(origin) === -1) {
      var message = 'The CORS policy for this origin doesnt ' +
        'allow access from the particular origin.';
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// io.on('connection', async socket => {
//   console.log("connection works")
//   socket.on("hi", async docId => {
//       console.log("in archer socket")
//       await archer.scrapeAllBusiness().then((returned) => {
//           console.log(JSON.stringify(returned) + " RETURNED IN ROUTER.JS")
//           socket.emit("hi", returned);

//       })

//   });
// });



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(404);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
