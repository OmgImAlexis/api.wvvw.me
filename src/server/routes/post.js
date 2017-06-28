import {Router} from 'express';
import HTTPError from 'http-errors';

import {Post} from '../models';
import {isValidObjectId} from '../middleware';

const router = new Router();

router.get(['/', '/:id'], isValidObjectId, async (req, res, next) => {
    if (req.params.id) {
        const post = await Post.findOne({
            _id: req.params.id
        }).populate('author comments').exec().catch(next);
        if (!post) {
            return next(new HTTPError.NotFound());
        }
        return res.send(post);
    }

    const posts = await Post.find({}).sort({
        date: -1
    }).exec().catch(next);

    return res.send({posts});
});

router.post('/', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(() => {
        return res.send({post});
    }).catch(next);
});

export default router;
