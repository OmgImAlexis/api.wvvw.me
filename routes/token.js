import jwt from 'jsonwebtoken';
import {Router} from 'express';
import HTTPError from 'http-errors';

import {User} from '../models';
import config from '../config';

const router = new Router();

router.post('/', (req, res, next) => {
    const user = User.findOne({
        username: req.body.username
    }).select('+password').exec().catch(next);

    if (!user) {
        return next(new HTTPError.NotFound('No user found.'));
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
            if (err === 'Incorrect arguments') {
                return next(new HTTPError.UnprocessableEntity('Missing params.'));
            }
            return next(err);
        }
        if (!isMatch) {
            return next(new HTTPError.Unauthorized('Invalid username and/or password.'));
        }

        delete user.password; // Just to be sure
        jwt.sign({
            username: user.username,
            iat: Math.floor(Date.now() / 1000) - 30 // Set issue date 30 seconds ago
        }, config.get('jwt.secret'), {
            expiresIn: 3600,
            issuer: 'wvvw.me'
        }, (err, token) => {
            if (err) {
                return next(err);
            }
            return res.send({
                token,
                expiresIn: 3600
            });
        });
    });
});

export default router;
