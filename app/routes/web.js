var express  = require('express'),
    md = require('marked'),
    path = require('path'),
    config = require('cz'),
    Post = require('../models/Post'),
    Page = require('../models/Page'),
    User = require('../models/User'),
    Comment = require('../models/Comment');

config.load(path.normalize(__dirname + '/../../config.json'));
config.args();
config.store('disk');

module.exports = (function() {
    var app = express.Router();

    app.use(function(req, res, next){
        res.locals.layout = {
            currentPage: req.path
        };
        next();
    });

    app.get('/', function(req, res){
        var criteria = req.user ? {} : {published: true};
        Post.find(criteria).populate('owner').sort({'_id': -1}).limit(10).exec(function(err, posts) {
            if(err) { console.log(err); }
            res.render('index', {
                posts: (posts.length) ? posts : [],
                md: md
            });
        });
    });

    app.get('/tagged/:tag', function(req, res){
        Post.find({tags: req.params.tag}).populate('owner').sort({'_id': -1}).limit(10).exec(function(err, posts) {
            res.render('index', {
                posts: (posts.length) ? posts : [],
                md: md
            });
        });
    });

    app.use('/search', function(req, res){
        var url = req.url.replace(/^\/|\/$/g, '').split("/");
        var searchTerm = url[0].length ? url[0] : req.body.searchTerm;
        Post.find({
            $text: {
                $search: searchTerm
            }
        },{
            score: {
                $meta: 'textScore'
            }
        }).populate('owner').sort({
            score: {
                $meta: 'textScore'
            }
        }).exec(function(err, posts) {
            if(err) { console.log(err); }
            if(posts.length){
                res.render('index', {
                    posts: posts,
                    md: md
                });
            } else {
                res.render('http/genericError', {
                    error: 'We couldn\'t find any posts with that search term.'
                });
            }
        });
    });

    app.get('/user/:userId', function(req, res){
        var userId = req.params.userId;
        var criteria = userId === 'anonymous' ? {_id: config.get('anon').userId} : {_id: userId};
        User.findOne(criteria).select('-password -__v').exec(function(err, user){
            if(err) { console.log(err); }
            res.render('user', {
                user: user
            });
        });
    });

    app.post('/new/comment', function(req, res){
        var comment = new Comment({
            owner: req.user.id,
            postId: req.body.postId,
            content: req.body.comment
        });
        comment.save(function(err, comment){
            if(err) {
                res.render('http/genericError', {
                    error: err
                });
            } else {
                Post.findOne({_id: req.body.postId}).exec(function(err, post){
                    if(err) { console.log(err); }
                    res.redirect('/post/' + post.slug + '#' + comment.id);
                });
            }
        });
    });

    app.get('/todo', function(req, res){
        Post.find({ published: false }).select('title').exec(function(err, posts){
            if(err) { console.log(err); }
            res.send({
                todo: posts
            });
        });
    });

    app.get('/*', function (req, res, next) {
        var url = (req.url.charAt(0) === '/' ? req.url.substr(1) : req.url).split('/');
        var format = config.get('permalink:format').substr(1).substr(0, config.get('permalink:format').substr(1).length-1).split('/');
        var slug = url[format.indexOf('%slug%')];
        var postId = url[format.indexOf('%postId%')];
        if(slug || postId) {
            var criteria = slug && postId ? {slug: slug, _id: postId} : slug ? {slug: slug} : {_id: postId};
            Post.findOne(criteria).populate('owner permalink').exec(function(err, post){
                if(err) { console.log(err); }
                if (post) {
                    Comment.find({postId: post.id}).populate('owner').limit(50).exec(function(err, comments){
                        if(err) { console.log(err); }
                        res.render('post', {
                            post: post,
                            comments: comments,
                            md: md
                        });
                    });
                } else {
                    next();
                }
            });
        } else {
            Page.findOne({url: req.url}, function(err, page){
                if(err) { console.log(err); }
                if (page) {
                   res.render('page', {
                       page: page,
                       md: md
                   });
               } else {
                   next();
               }
            });
        }
    });

    return app;
})();
