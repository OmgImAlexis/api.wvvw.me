import {Types} from 'mongoose';
import {UnprocessableEntity} from 'http-errors';

const {isValid} = Types.ObjectId;

const isValidObjectId = (req, res, next) => {
    if (req.params.id && !isValid(req.params.id)) {
        return next(new UnprocessableEntity('Invalid ObjectId.'));
    }
    return next();
};

export default isValidObjectId;
