import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    displayName: {
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
});

userSchema.pre('save', function(next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err) {
            console.error(err);
            next(err);
        }
        user.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    const hash = this.password;
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

export default mongoose.model('User', userSchema);
