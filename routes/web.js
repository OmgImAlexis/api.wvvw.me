var express  = require('express'),
    Post     = require('../models/Post');

module.exports = (function() {
    var app = express.Router();

    app.use(function(req, res, next){
        Post.find({published: true}).sort({'_id': -1}).limit(10).exec(function(err, posts) {
            if (err) console.log(err);
            res.locals = {
                layout: {
                    fullWidth: false,
                    sidebarPosts: posts
                }
            };
            next();
        });
    });

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/about', function(req, res){
        res.render('about');
    });

    app.get('/tagged/:tag', function(req, res){
        Post.find({tags: req.params.tag}).sort({'_id': -1}).limit(10).exec(function(err, posts) {
            res.render('index', posts);
        });
    });

    app.get('/search', function(req, res){
        var searchTerms = req.query.searchTerms;
        Post.find({
            $text : {
                $search : searchTerms
            }
        },{
            score : {
                $meta: 'textScore'
            }
        }).sort({
            score : {
                $meta : 'textScore'
            }
        }).exec(function(err, posts) {
            if (err) console.log(err);
            // res.render('search');
            res.send(posts);
        });
    });

    app.get('/post/:slug', function(req, res){
        Post.findOne({slug: req.params.slug}).exec(function(err, post) {
            if (err) console.log(err);
            if (!post.published) {
                res.status(200).send({err: 'This post has not been published yet.'});
            } else {
                res.render('post', post);
            }
        });
    });

    return app;
})();
