const express = require('express');
const router = express.Router();


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

router.post('/add',ensureAuthentication,function (req,res) {

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
        article.body = req.body.Body;

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
router.post('/edit/:id', function (req,res) {

    let article = {};

    article.title = req.body.Title;
    article.author = req.body.Author;
    article.body = req.body.Body;

    let query = {_id:req.params.id};

    Article.update(query,article,function (err) {
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