var express  = require('express'),
    _ = require('underscore'),
    Post = require('../models/Post'),
    Menu = require('../models/Menu'),
    User = require('../models/User');

module.exports = (function() {
    var app = express.Router();

    app.use(function(req, res, next){
        Post.find({published: true}).populate('owner').sort({'_id': -1}).limit(10).exec(function(err, posts) {
            if (err) console.log(err);
            res.locals.layout = {
                fullWidth: false,
                sidebarPosts: posts,
                currentPage: req.path
            };
            next();
        });
    });

    app.use(function(req, res, next){
        Menu.find({}).exec(function(err, menus){
            if (err) console.log(err);
            res.locals.layout.menus = menus;
            next();
        });
    });

    app.get('/', function(req, res){
        Post.find({}).populate('owner').sort({'_id': -1}).limit(10).exec(function(err, posts) {
            if (err) console.log(err);
            res.render('index', {
                posts: posts
            });
        });
    });

    app.get('/about', function(req, res){
        res.render('about');
    });

    app.get('/tagged/:tag', function(req, res){
        Post.find({tags: req.params.tag}).populate('owner').sort({'_id': -1}).limit(10).exec(function(err, posts) {
            res.render('index', {
                posts: posts
            });
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
        }).populate('owner').sort({
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
        Post.findOne({slug: req.params.slug}).populate('owner').exec(function(err, post) {
            if (err) console.log(err);
            if (!post.published) {
                res.status(200).send({err: 'This post has not been published yet.'});
            } else {
                res.render('post', post);
            }
        });
    });

    app.get('/dev', function(req, res){
        res.send(res.locals);
    });

    return app;
})();
