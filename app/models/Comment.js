var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    date: { type: Date },
    content: { type: String, required: true }
});

commentSchema.pre('save', function (next) {
    this.date = this._id.getTimestamp();
    next();
});

module.exports = mongoose.model('Comment', commentSchema);
