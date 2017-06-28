import express from 'express';
import bodyParser from 'body-parser';
import loudRejection from 'loud-rejection';
import jwt from 'express-jwt';
import {errorHandler, notFoundHandler} from 'express-api-error-handler';

import config from './config';
import log from './log';
import {post, user, token} from './routes';

// Stops promises being silent
loudRejection();

const app = express();

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('*', jwt({
    secret: config.get('jwt.secret')
}).unless({
    path: ['/token', '/user', '/user/']
}));

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.use('/post', post);
app.use('/user', user);
app.use('/token', token);

app.use('/healthcheck', (req, res) => {
    res.status(200).json({
        uptime: process.uptime()
    });
});

app.use(errorHandler({
    log: ({err, req, body}) => {
        log.error(err, `${body.status} ${req.method} ${req.url}`);
    },
    // This hides 5XX errors in production to prevent info leaking
    hideProdErrors: true
}));

app.use(notFoundHandler({
    log: ({req}) => {
        log.info(`404 ${req.method} ${req.url}`);
    }
}));

export default app;
