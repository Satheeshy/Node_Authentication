//set up

var express = require('express');
var app = express();
var port  = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

//use mongoose orm model to connect to database

mongoose.connect(configDB.url);
//mongoose.connect('mongodb://user:pass@localhost:port/database', { config: { autoIndex: false } });
require('./config/passport')(passport);

//set up our express application
//console.log("cookie parser..........",cookieParser);
//console.log("bodyparser............",bodyParser.json);
//console.log("session........",session);
//console.log("passsport.initialize.......",passport.initialize);
console.log("passport.session...........",passport.session);
app.use(morgan('dev')); //log every request to console
app.use(cookieParser()); // read cookies

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine','ejs'); // ejs for templating

//required for passport
app.use(session({
    secret: 'ksadjfasdhfiewoqfjlsa',
    resave: true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());  //persistent login sessions
app.use(flash()); // flash messages in session

//routes
require('./app/routes.js')(app,passport); // load our routes and pass in our app and fully configured passport

app.listen(port);



