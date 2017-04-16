import jwt from 'jsonwebtoken';
import {Router} from 'express';
import {User} from '../models';
import {config} from '../';

const router = new Router();

router.post('/', (req, res) => {
    User.findOne({
        username: req.body.username
    }).select('+password').exec((err, user) => {
        if (err) {
            // @TODO: Handle error
            console.error(err);
        }
        if (user) {
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).json({
                        message: 'Either no user was found or you suppplied an incorrect user/pass.'
                    });
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
                        return res.status(500).json(err);
                    }
                    res.status(201).json({
                        token,
                        expiresIn: 3600
                    });
                });
            });
        } else {
            res.status(401).json({
                message: 'Either no user was found or you suppplied an incorrect user/pass.'
            });
        }
    });
});

export default router;
