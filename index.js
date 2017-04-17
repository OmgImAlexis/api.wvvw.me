import crypto from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from 'express-jwt';
import Cz from 'cz';

import {
    post,
    user,
    token
} from './routes';

const config = new Cz();
const app = express();

config.load('./config.json');

config.set('port', process.env.PORT || 4040);
config.set('db', {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/wvvw_me',
    options: {
        user: process.env.MONGO_USER || '',
        pass: process.env.MONGO_PASS || ''
    }
});
config.set('jwt', {
    secret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex')
});

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(config.get('db:url'), {
        ...config.get('db:options')
    }).then(() => {
        console.log(`Successfully connected to MongoDB`);
    }).catch(err => {
        console.error(`Cannot connect to MongoDB`, err);
        process.exit(); // eslint-disable-line unicorn/no-process-exit
    });
}

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('jwtSecret', config.get('jwt:secret'));

app.post('*', jwt({
    secret: config.get('jwt:secret')
}).unless({
    path: ['/token', '/user']
}));

app.get('/', (req, res) => {
    res.send('Welcome to the API that powers my blog. It can be accessed via https://wvvw.me');
});

app.use('/post', post);
app.use('/user', user);
app.use('/token', token);

app.use((err, req, res, next) => {
    if (!err) {
        next();
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send('Invalid token');
    }
    if (err.name === 'RestError') {
        return res.status(err.status).send({
            message: err.message
        });
    }
    return res.sendStatus(500);
});

app.use((req, res) => {
    res.sendStatus(404);
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(config.get('port'), () => {
        console.info(`The server is running on port ${config.get('port')}`);
    });
}

process.on('uncaughtException', err => {
    console.error('Caught exception', err);
});

export default app;

export {
    app,
    config
};
