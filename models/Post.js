var mongoose = require('mongoose'),
    slug = require('mongoose-slug-unique');

var postSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String }
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
    next();
});

module.exports = mongoose.model('Post', postSchema);
