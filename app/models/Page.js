var mongoose = require('mongoose');

var pageSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
    url: { type: String }
});

pageSchema.index({ title: 'text', content: 'text', slug: 'text' });

pageSchema.pre('save', function (next) {
    this.date = this._id.getTimestamp();
    next();
});

module.exports = mongoose.model('Page', pageSchema);
