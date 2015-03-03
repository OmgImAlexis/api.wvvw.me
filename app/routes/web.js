var express  = require('express'),
    _ = require('underscore'),
    Post = require('../models/Post'),
    Menu = require('../models/Menu'),
    User = require('../models/User'),
    Page = require('../models/Page'),
    Route = require('../models/Route');

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
            var Showdown = require('showdown');
            var converter = new Showdown.converter();
            var finished = _.after(posts.length, doContinue);
            for(i = 0; i < posts.length; i++) {
                posts[i].content = converter.makeHtml(posts[i].content);
                finished();
            }
            function doContinue() {
                res.render('index', {
                    posts: posts
                });
            };
        });
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

    app.get('/*', function (req, res) {
        var url = req.url.replace(/^\/|\/$/g, '').split("/");
        var base = url[0];
        var slug = url.slice(1).join('/');
        Route.findOne({base: base}, function(err, route){
            if (err) console.log(err);
            if(route) {
                Post.findOne({slug: slug}).populate('owner').exec(function(err, post) {
                    if (err) console.log(err);
                    if (!post) {
                        res.send('POST NOT FOUND!');
                    } else {
                        if (!post.published) {
                           res.status(200).send({err: 'This post has not been published yet.'});
                        } else {
                           res.render('post', post);
                        }
                    }
                });
            } else {
                Page.findOne({url: req.url}, function(err, page){
                    if (err) console.log(err);
                    if (!page) {
                        res.send('404 NO ROUTE FOUND!');
                    } else {
                        if (!page.published) {
                           res.status(200).send({err: 'This page has not been published yet.'});
                       } else {
                           res.render('page', page);
                       }
                    }
                });
            }
        });
    });

    return app;
})();
