import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    date: {
        type: Date,
        required: true
    }
});

export default mongoose.model('Comment', commentSchema);
