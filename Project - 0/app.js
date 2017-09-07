var express = require('express');
var bodyParser = require('body-parser');

var path = require('path');
var expressValidator = require('express-validator');

var app = express();

var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectID;
/* middle ware
var logger = function (req,res,next) {
    console.log("logging...");
    next();
}
app.use(logger);
*/

//View Engine

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// Set static path

app.use(express.static(path.join(__dirname,'./public')));

app.use(function (req,res,next) {
    res.locals.errors = null;
    next();
})

var users = [
    {
        id: "1",
        first_name: "Ajay",
        last_name: "Thorve",
        email: "aat414@gmail.com"
    },
    {
        id: "2",
        first_name: "Sri",
        last_name: "Raghvan",
        email: "sri414@gmail.com"
    },
    {
        id: "3",
        first_name: "Deepak",
        last_name: "Thorve",
        email: "dee414@gmail.com"
    }
];
app.get('/',function (req,res) {
    // find everything
    db.users.find(function (err, docs) {
        res.render('index',{title: 'customers', users: docs});
    });


});

app.post('/users/add',(req,res) =>{
    req.checkBody('first_name', 'must be filled').notEmpty();
    req.checkBody('last_name', 'must be filled').notEmpty();
    req.checkBody('email', 'Should be email').isEmail();

    var errors = req.validationErrors();
    if(errors){
        db.users.find(function (err, docs) {
            res.render('index',{title: 'customers', users: docs, errors: errors});
        });
        console.log("Errors");
    }
    else{
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        };
        db.users.insert(newUser, function (err, result) {
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });

    }

});

app.delete('/users/delete/:id',function (req,res) {
    console.log(req.params.id);
    db.users.remove({
        _id: ObjectId(req.params.id)
    },function (err,result) {
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
})
app.listen(3000, function () {
    console.log("Server started: port 3000");
});