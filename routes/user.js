import {Router} from 'express';
import {User} from '../models';
import {isValidObjectId} from '../utils';

const router = Router();

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
        User.find({}).sort({ date: -1 }).exec((err, users) => {
            if (err) {
                return res.send(err);
            }
            res.send(users);
        });
    }
});

router.post('/', (req, res) => {
    let user = new User({
        ...req.body
    });
    user.save((err, created) => {
        if (err) {
            console.error(err);
            return res.send(err);
        }
        if (created) {
            return res.send(user);
        }
    });
});

export default router;
