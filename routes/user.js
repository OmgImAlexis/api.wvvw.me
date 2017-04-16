import {Router} from 'express';

import {config} from '../';
import {User} from '../models';
import {isValidObjectId} from '../utils';

const router = new Router();

router.get(['/', '/:id'], (req, res) => {
    if (req.params.id) {
        if (!isValidObjectId(req.params.id)) {
            return res.sendStatus(422);
        }
        User.find({
            _id: req.params.id
        }).exec((err, user) => {
            if (err) {
                console.error(err);
                return res.send(err);
            }
            res.send(user);
        });
    } else {
        User.find({}).sort({
            date: -1
        }).exec((err, users) => {
            if (err) {
                return res.send(err);
            }
            res.send(users);
        });
    }
});

router.post('/', (req, res) => {
    if (config.get('signups:enabled')) {
        const user = new User({
            username: req.body.username || undefined,
            email: req.body.email || undefined,
            password: req.body.password
        });
        user.save((err, created) => {
            if (err) {
                // Duplicate field
                if (err.code === 11000) {
                    return res.status(503).json({
                        message: 'Please choose another username.'
                    });
                }
                return res.status(500).json({
                    error: err
                });
            }
            if (created) {
                return res.status(201).json({
                    message: 'User created successfully.'
                });
            }
        });
    } else {
        return res.status(503).json({
            message: 'Signups currently disabled.'
        });
    }
});

export default router;
