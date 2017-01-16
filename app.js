const express = require('express');
const async = require('async');
const bodyParser = require('body-parser');
const Datastore = require('nedb');
const bcrypt = require('bcrypt');
const jwt = require('express-jwt');

const app = express();

const port = process.env.PORT || 4040;

const posts = new Datastore({
    filename: './dbs/posts.json',
    autoload: true
});
const users = new Datastore({
    filename: './dbs/users.json',
    autoload: true
});
const secrets = new Datastore({
    filename: './dbs/secrets.json',
    autoload: true
});

app.disable('x-powered-by');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('*', jwt({
    secret: 'secret'
}), (req, res, next) => {
    users.find({
        jwt: req.headers.jwt
    }).exec((err, user) => {
        if (err) {
            return res.send(err);
        }
        if (user) {
            return next();
        } else {
            return next('/')
        }
    });
});

app.get('/', (req, res) => {
    res.send('Welcome!');
});

app.get('/posts', (req, res) => {
    posts.find({}).sort({ date: -1 }).exec((err, posts) => {
        if (err) {
            console.log(err);
        } else {
            async.eachSeries(posts, (post, cb) => {
                users.findOne({
                    _id: post.owner
                }, {
                    password: 0
                }, (err, owner) => {
                    if (err) {
                        console.log(err);
                    } else {
                        post.owner = owner;
                        cb();
                    }
                });
            }, () => {
                res.send(posts);
            });
        }
    });
});

app.post('/posts', (req, res) => {
    posts.insert(req.body, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.send(post);
        }
    });
});

app.post('/users', (req, res) => {
    users.insert(req.body, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            res.send(user);
        }
    });
});

app.get('/posts/:id', (req, res) => {
    posts.findOne({
        _id: req.params.id
    }, (err, post) => {
        if (err) {
            console.log(err);
        }
        res.send(post);
    });
});

app.use((req, res) => {
    res.status(404);
});

app.use((error, req, res) => {
    res.status(500);
});

app.listen(port, function() {
    console.log(`The server is running on port ${port}`);
});
