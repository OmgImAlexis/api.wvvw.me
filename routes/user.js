import {Router} from 'express';
import HTTPError from 'http-errors';

import log from '../log';
import config from '../config';
import {User} from '../models';
import {isValidObjectId} from '../middleware';

const router = new Router();

router.get(['/', '/:id'], isValidObjectId, async (req, res, next) => {
    if (req.params.id) {
        const user = await User.find({
            _id: req.params.id
        }).exec().catch(next);

        return res.send(user);
    }

    const users = await User.find({}).sort({
        date: -1
    }).exec().catch(next);

    res.send(users);
});

router.post('/', (req, res, next) => {
    if (!config.get('signups.enabled')) {
        // @TODO: This may not be the best status code for this.
        return next(new HTTPError.MethodNotAllowed('Signups are currently disabled.'));
    }

    const user = new User({
        username: req.body.username || '',
        email: req.body.email || '',
        password: req.body.password
    });
    user.save().then(() => {
        log.debug('User saved.');
        return res.status(201).send({
            user
        });
    }).catch(err => {
        log.debug('User error.');
        // Duplicate field
        if (err.code === 11000) {
            return next(new HTTPError.Conflict('User already exists.'));
        }
        return next(err);
    });
});

export default router;
