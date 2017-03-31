import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);
