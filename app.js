var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session')
const mongoClient=require('mongodb').MongoClient
const {Db}=require('mongodb')
const db=require('./config/connection')
const paypal=require('paypal-rest-sdk')
 var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
const { Cookie } = require('express-session');
const { userLogin_get } = require('./CONTROLLER/USER-CONTROLLER/user-login');

var app = express();


// view engine setup
// app.set('views', path.join(__dirname, 'views/users'));
app.set('views', [__dirname + '/views/users', __dirname + '/views/admin-test'])
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));


//session
app.use(session({
  secret:"Key",
  cookie:{maxAge:600000}
}))


//database
db.connect((err)=>{
  if(err)
    console.log("Databsae Connection Failed" +err);

  else
    console.log('Database Connected Successfully');  
})


//cache
app.use(function(req, res, next) {
  if (!req.user) {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
  }
  next();
});


app.use('/', adminRouter);
app.use('/', usersRouter);


//payapl-integration


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
   userlog = req.session.user
   adminlog = req.session.admin 
  res.render('error',{userlog,adminlog});
});


const PORT=process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`);
})

module.exports = app;
