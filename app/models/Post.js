var mongoose = require('mongoose'),
    nconf = require('nconf');

var postSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, required: true },
    title: { type: String, required: true },
    date: { type: Date },
    content: { type: String, required: true },
    slug: { type: String },
    tags : { type : Array , default : [] },
    commentsEnabled: { type: Boolean, required: true, default: true },
    anonymous: { type: Boolean, default: nconf.get('anon:default') }
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

postSchema.virtual('permalink').get(function () {
    var format = nconf.get('permalink:format');
    var date = new Date(this._id.getTimestamp());
    return format
        .replace('%slug%', this.slug)
        .replace('%postId%', this._id)
        // .replace('%author%', slugify(this.owner.name))
        .replace('%year%', date.getFullYear())
        .replace('%month%', ('0' + date.getMonth()).slice(-2))
        .replace('%day%', ('0' + date.getDate()).slice(-2))
        .replace('%hour%', ('0' + date.getHours()).slice(-2))
        .replace('%minute%', ('0' + date.getMinutes()).slice(-2))
        .replace('%second%', ('0' + date.getSeconds()).slice(-2));
});

module.exports = mongoose.model('Post', postSchema);
