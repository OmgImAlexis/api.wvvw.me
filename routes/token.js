import jwt from 'jsonwebtoken';
import {Router} from 'express';
import {User} from '../models';
import RestError from '../utils/rest-error';
import {
    TOKEN
} from '../utils/consts';
import {config} from '../';

const router = new Router();

router.post('/', (req, res, next) => {
    User.findOne({
        username: req.body.username
    }).select('+password').exec((err, user) => {
        if (err) {
            return next(err);
        }
        if (user) {
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) {
                    if (err === 'Incorrect arguments') {
                        return next(new RestError(TOKEN.MISSING_PARAM));
                    }
                    return next(err);
                }
                if (!isMatch) {
                    return next(new RestError(TOKEN.INVALID_DETAILS));
                }
                delete user.password; // Just to be sure
                jwt.sign({
                    username: user.username,
                    iat: Math.floor(Date.now() / 1000) - 30 // Set issue date 30 seconds ago
                }, config.get('jwt:secret'), {
                    expiresIn: 3600,
                    issuer: 'wvvw.me'
                }, (err, token) => {
                    if (err) {
                        return next(err);
                    }
                    return res.status(TOKEN.CREATED.SUCCESS.status).json({
                        message: TOKEN.CREATED.SUCCESS.message,
                        data: {
                            token,
                            expiresIn: 3600
                        }
                    });
                });
            });
        } else {
            return next(new RestError(TOKEN.INVALID_DETAILS));
        }
    });
});

export default router;
