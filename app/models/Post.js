var mongoose = require('mongoose'),
    config = require('../../config/config.js');

var postSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, required: true },
    title: { type: String, required: true },
    date: { type: Date },
    content: { type: String, required: true },
    slug: { type: String },
    tags : { type : Array , default : [] },
    commentsEnabled: { type: Boolean, required: true, default: true },
    anonymous: { type: Boolean, default: config.db.anonDefault }
});

postSchema.index({ title: 'text', content: 'text', slug: 'text' });

function slugify(text) {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

postSchema.pre('save', function (next) {
    this.slug = slugify(this.title);
    this.date = this._id.getTimestamp();
    next();
});

module.exports = mongoose.model('Post', postSchema);
