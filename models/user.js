import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {config} from '../index';

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

    bcrypt.genSalt(config.get('bcypt:rounds'), (err, salt) => {
        if (err) {
            next(err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                next(err);
            }
            this.password = hash;
        });
    });
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
