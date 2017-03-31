import express from 'express';
import async from 'async';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'express-jwt';
import crypto from 'crypto';

const app = express();

const port = process.env.PORT || 4040;
const db = {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/wvvw_me',
    options: {
        user: process.env.MONGO_USER || '',
        pass: process.env.MONGO_PASS || ''
    }
};
const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

mongoose.Promise = global.Promise;

mongoose.connect(db.url, {
    ...db.options
}).then(() => {
    console.log(`Successfully connected to MongoDB`);
}).catch((err) => {
    console.error(`Cannot connect to MongoDB`, err);
    process.exit();
});

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('jwtSecret', jwtSecret);

app.post('*', jwt({
    secret: jwtSecret
}).unless({
    path: ['/token']
}));

app.get('/', (req, res) => {
    res.send('Welcome to the API that powers my blog. It can be accessed via https://wvvw.me');
});

import {
    post,
    user,
    token
} from './routes';

app.use('/post', post);
app.use('/user', user);
app.use('/token', token);

app.use((req, res) => {
    res.status(404);
});

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send('Invalid token');
    }
    res.status(500);
});

app.listen(port, function() {
    console.log(`The server is running on port ${port}`);
});

process.on('uncaughtException', err => {
    console.log('Caught exception', err);
});
