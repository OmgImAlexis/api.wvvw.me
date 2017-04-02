import {Router} from 'express';
import {Post} from '../models';
import {isValidObjectId} from '../utils';

const router = new Router();

router.get(['/', '/:id'], (req, res) => {
    if (req.params.id) {
        if (!isValidObjectId(req.params.id)) {
            return res.sendStatus(422);
        }
        Post.find({
            _id: req.params.id
        }).populate('author comments').exec((err, post) => {
            if (err) {
                console.error(err);
                return res.send(err);
            }
            res.send(post);
        });
    } else {
        Post.find({}).sort({
            date: -1
        }).exec((err, posts) => {
            if (err) {
                console.error(err);
                return res.send(err);
            }
            res.send(posts);
        });
    }
});

router.post('/', (req, res) => {
    const post = new Post({
        ...req.body
    });
    post.save((err, created) => {
        if (err) {
            console.error(err);
            return res.send(err);
        }
        if (created) {
            return res.send(post);
        }
    });
});

export default router;
