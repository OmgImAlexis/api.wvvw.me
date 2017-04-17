import {Router} from 'express';

import {config} from '../';
import {User} from '../models';
import isValidObjectId from '../utils/is-valid-object-id';
import RestError from '../utils/rest-error';
import {
    USER
} from '../utils/consts';

const router = new Router();

router.get(['/', '/:id'], (req, res, next) => {
    if (req.params.id) {
        if (!isValidObjectId(req.params.id)) {
            return res.sendStatus(422);
        }
        User.find({
            _id: req.params.id
        }).exec((err, user) => {
            if (err) {
                return next(err);
            }
            res.send(user);
        });
    } else {
        User.find({}).sort({
            date: -1
        }).exec((err, users) => {
            if (err) {
                return next(err);
            }
            res.send(users);
        });
    }
});

router.post('/', (req, res, next) => {
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
                    return next(new RestError(USER.CREATED.FAILURE.DUPLICATE));
                }
                return next(err);
            }
            if (created) {
                return res.status(USER.CREATED.SUCCESS.status).json({
                    message: USER.CREATED.SUCCESS.message,
                    data: {
                        user
                    }
                });
            }
        });
    } else {
        next(new RestError(USER.CREATED.FAILURE.DISABLED));
    }
});

export default router;
