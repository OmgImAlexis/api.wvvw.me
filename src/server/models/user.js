import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config';

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    displayName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        sparse: true // This allows multiple docs with no email
    }
});

userSchema.pre('save', function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, config.get('bcypt.rounds'));
    next();
});

userSchema.methods.comparePassword = function(hash, next) {
    bcrypt.compare(hash, this.password, (err, isMatch) => {
        if (err) {
            return next(err);
        }
        next(null, isMatch);
    });
};

export default mongoose.model('User', userSchema);
