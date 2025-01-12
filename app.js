var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var authorization = require('./authorization');
var session = require("express-session");
var MemoryStore = require("memorystore")(session);

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var signupRouter = require('./routes/signup');
var catalogRouter = require('./routes/catalog');
var trendingRouter = require('./routes/trending');
var followingRouter = require('./routes/following');
var settingsRouter = require('./routes/settings');
var userRouter = require('./routes/user');
var searchRouter = require('./routes/search');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    name: "loginSession",
    secret: "cs341",
    store: new MemoryStore({
        checkPeriod: 1 * 60 * 60 * 1000
    }),
    resave: false,
    saveUninitialized: false,
    //secure is false because we are not using https
    cookie: { secure: false, sameSite: "strict", maxAge: 1 * 60 * 60 * 1000}
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);
// All routers above this line do not require login
app.use(authorization.doAuthorization);
app.use('/', indexRouter);
app.use('/catalog', catalogRouter);
app.use('/trending', trendingRouter);
app.use('/following', followingRouter);
app.use('/settings', settingsRouter);
app.use('/user', userRouter);
app.use('/search', searchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  const message = err.message;
  const error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error', {message: message, error: error});
});

module.exports = app;
