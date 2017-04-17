import {Router} from 'express';
import {Post} from '../models';
import isValidObjectId from '../utils/is-valid-object-id';
import RestError from '../utils/rest-error';
import {
    POST
} from '../utils/consts';

const router = new Router();

router.get(['/', '/:id'], (req, res, next) => {
    if (req.params.id) {
        if (!isValidObjectId(req.params.id)) {
            return next(new RestError(POST.INVALID_DETAILS));
        }
        Post.findOne({
            _id: req.params.id
        }).populate('author comments').exec((err, post) => {
            if (err) {
                return next(err);
            }
            if (!post) {
                return next(new RestError(POST.NOT_FOUND));
            }
            return res.send(post);
        });
    } else {
        Post.find({}).sort({
            date: -1
        }).exec((err, posts) => {
            if (err) {
                return next(err);
            }
            return res.send(posts);
        });
    }
});

router.post('/', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save((err, created) => {
        if (err) {
            return next(err);
        }
        if (created) {
            return res.status(POST.CREATED.SUCCESS.status).json({
                message: POST.CREATED.SUCCESS.message,
                data: {
                    post
                }
            });
        }
    });
});

export default router;
