import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const autoPopulateAuthor = function(next) {
    this.populate('author');
    next();
};

commentSchema.pre('findOne', autoPopulateAuthor).pre('find', autoPopulateAuthor);

export default mongoose.model('Comment', commentSchema);
