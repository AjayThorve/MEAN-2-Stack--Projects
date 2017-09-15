const multer = require('multer');

const express = require('express');
const router = express.Router();
const fs = require('fs');


//uploading variable of multer

let uploading = multer({
    dest: 'public/uploads/user_images/',
    limits: {fileSize: 1000000, files:1},
});

//Bring in article model
let Article = require('../models/articles');
//Bring in user model
let User = require('../models/users');


//Add route
router.get('/add',function (req,res) {
    res.render('add_article',{
        title : "Add articles"
    });
});

router.post('/add',ensureAuthentication,uploading.single('img'),function (req,res) {

    req.checkBody('Title', 'Title must be filled').notEmpty();
    //req.checkBody('Author', 'Author must be filled').notEmpty();
    req.checkBody('Body', 'Body must be filled').notEmpty();
    let errors = req.validationErrors();
    if(errors){
        errors.forEach(function (e) {
            req.flash('danger',e.msg);
        });
        res.render('add_article',{
            title : "Add articles"
        });
        console.log("Errors");
    }
    else {
        let article = new Article();

        article.title = req.body.Title;
        article.author = req.user._id;
        console.log(req.user._id);
        article.body = req.body.Body;
        article.image_url="";
        if(req.file){
            console.log(req.file);
            let temp = req.file.originalname.split('.');
            let temp1 = req.file.path.split('/');
            article.image_url= temp1[1]+'/'+temp1[2]+'/'+temp1[3];
        }
        article.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', 'Article added successfully!');
                res.redirect('/');
            }
        });
    }
});


//Edit Single Article
router.get('/edit/:id',ensureAuthentication,function (req,res) {
    Article.findById(req.params.id,function (err,article) {
        if(article.author != req.user._id){
            req.flash('danger','Not Authorized');
            res.redirect('/');
        }
        else{
            res.render('edit_article',{
                article:article
            });
        }
    });
});

//Update the article
router.post('/edit/:id',uploading.single('img'),function (req,res) {

    let article = {};


    article.title = req.body.Title;
    article.body = req.body.Body;
    if(req.file){
        console.log(req.file);
        let temp = req.file.originalname.split('.');
        let temp1 = req.file.path.split('/');
        article.image_url= temp1[1]+'/'+temp1[2]+'/'+temp1[3];

        //remove old file from uploads/user_images folder
        Article.findById(req.params.id,function (err,article) {
            if (article.author != req.user._id) {
                res.status(500).send();
            }else{
                let temp = article.image_url.split('.');
                if(temp[0]!=""){
                    fs.unlink('public/'+temp[0],function (err) {
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }
        });
    }
    let query = {_id:req.params.id};

    Article.update(query,{$set:article},function (err) {
        if(err){
            console.log(err);
        }else{
            req.flash('success','Article updated successfully!');
            res.redirect('/articles/'+req.params.id);
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

router.delete('/:id',function (req,res) {
    //if user not authenticated
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id: req.params.id};

    //if author not authenticated
    Article.findById(req.params.id,function (err,article) {
        if (article.author != req.user._id) {
            res.status(500).send();
        }else{
            let temp = article.image_url.split('.');
            if(temp[0]!=""){
                fs.unlink('public/'+temp[0],function (err) {
                    if(err){
                        console.log(err);
                    }
                });
            }
            Article.remove(query, function (err) {
                if(err){
                    console.log(err);
                }
                req.flash('danger','Message deleted!');
                res.send('Success');
            });
        }
    });


});

//Get Single Article
router.get('/:id',function (req,res) {

    Article.findById(req.params.id,function (err,article) {
        if(err){
            console.log(err);
        }else {

            User.findById(article.author, function (err1, user) {
                if(err1){
                    console.log(err1);
                }
                else
                    {
                        res.render('article', {
                            article: article,
                            author: user.name
                        });
                    }
            });
        }
    });
});

//ensure Authentication
function ensureAuthentication(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('danger','Please login');
        res.redirect('/users/login');
    }
}
module.exports = router;