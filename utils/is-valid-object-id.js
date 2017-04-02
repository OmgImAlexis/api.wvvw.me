import mongoose from 'mongoose';

const isValidObjectId = objectId => {
    return mongoose.Types.ObjectId.isValid(objectId);
};

export default isValidObjectId;
