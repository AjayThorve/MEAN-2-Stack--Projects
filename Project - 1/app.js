const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const multer = require('multer');

//mongodb connection
mongoose.connect(config.database);
var db = mongoose.connection;

//check db connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("App started and connected to mongoDB");
});

//Init app
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

const passport = require('passport');

// expressValidator middleware
app.use(expressValidator());



//use static location
app.use(express.static(path.join(__dirname,'public')));


//Adding express-session middleware
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//express-messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


//Bring in article model
let Article = require('./models/articles');


//Load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//global variable that runs throughout when the session exists
app.get('*',function (req,res,next) {
    res.locals.user = req.user || null;
    //console.log(res.locals.user);
    next();
});

//Home route
app.get('/',function (req,res) {

    Article.find({},function (err, articles) {
        if(err){
            console.log(err);
        }else{
            res.render('index',{
                "title": "Ajay",
                "article": articles
            });
        }

    });

});



//add routes
app.use('/articles',require('./routes/articles'));
app.use('/users',require('./routes/users'));


//Start server
app.listen(3000,function () {
    console.log("Server listening on port: 3000");
});