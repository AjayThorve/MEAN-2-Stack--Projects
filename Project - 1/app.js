const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//mongodb connection
mongoose.connect('mongodb://localhost/nodekb');
var db = mongoose.connection;

//check db connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("We are connected baby!");
});

//Init app
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//use static location
app.use(express.static(path.join(__dirname,'public')));

//Bring in models

let Article = require('./models/articles');

//Load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');
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

//Add route

app.get('/articles/add',function (req,res) {
    res.render('add_article',{
        title : "Add articles"
    });
});

app.post('/articles/add',function (req,res) {
    let article = new Article();

    article.title = req.body.Title;
    article.author = req.body.Author;
    article.body = req.body.Body;

    article.save(function (err) {
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
});

//Get Single Article
app.get('/article/:id',function (req,res) {
    Article.findById(req.params.id,function (err,article) {
        if(err){
            console.log(err);
        }else{
            res.render('article',{
                article:article
            });
        }
    });
});

//Edit Single Article
app.get('/article/edit/:id',function (req,res) {
    Article.findById(req.params.id,function (err,article) {
        if(err){
            console.log(err);
        }else{
            res.render('edit_article',{
                article:article
            });
        }
    });
});

//Update the article
app.post('/article/edit/:id', function (req,res) {

    let article = {};

    article.title = req.body.Title;
    article.author = req.body.Author;
    article.body = req.body.Body;

    let query = {_id:req.params.id};

    Article.update(query,article,function (err) {
        if(err){
            console.log(err);
        }else{
            res.redirect('/article/'+req.params.id);
        }
    });

    // My method below, works too
    // Article.update({_id:req.body.id},
    //     {
    //         $set:
    //         {
    //             title:req.body.Title,
    //             author: req.body.Author,
    //             body: req.body.Body
    //         }
    //     }, function (err,raw) {
    //         if(err){
    //             console.log(err);
    //         }else{
    //             res.redirect('/article/'+req.body.id);
    //         }
    //     });
});


//delete article

app.delete('/article/:id',function (req,res) {

    let query = {_id: req.params.id};
    Article.remove(query, function (err) {
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
});
//Start server
app.listen(3000,function () {
    console.log("Server listening on port: 3000");
});