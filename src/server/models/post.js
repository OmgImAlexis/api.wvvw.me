import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    published: {
        type: Boolean,
        default: false
    }
});

const autoPopulateAuthor = function(next) {
    this.populate('author');
    next();
};

postSchema.pre('findOne', autoPopulateAuthor).pre('find', autoPopulateAuthor);

export default mongoose.model('Post', postSchema);
