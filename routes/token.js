import jwt from 'jsonwebtoken';
import {Router} from 'express';
import {User} from '../models';
import {isValidObjectId} from '../utils';

const router = Router();

router.post('/', (req, res) => {
    User.findOne({
        username: req.body.username
    }).select('+password').exec((err, user) => {
        if (err) {
            console.error(err);
            return res.send(err);
        }
        if (user) {
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.sendStatus(401);
                } else {
                    delete user.password; // Just to be sure
                    jwt.sign({
                        username: user.username,
                        iat: Math.floor(Date.now() / 1000) - 30 // Set issue date 30 seconds ago
                    }, req.app.get('jwtSecret'), {
                        expiresIn: 3600,
                        issuer: 'wvvw.me',
                    }, (err, token) => {
                        if (err) {
                            return res.send(err);
                        }
                        res.send({
                            token,
                            expiresIn: 3600
                        });
                    });
                }
            });
        }
    });
});

export default router;
