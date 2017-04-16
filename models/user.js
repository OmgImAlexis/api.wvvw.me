import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

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

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) {
            console.error(err);
            next(err);
        }
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(candidatePassword, next) {
    const hash = this.password;
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) {
            return next(err);
        }
        next(null, isMatch);
    });
};

export default mongoose.model('User', userSchema);
