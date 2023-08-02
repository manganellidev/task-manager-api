/* eslint-disable func-names */
const { model, Schema } = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid.');
                }
            }
        },
        age: {
            type: String,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must be a positive number.');
                }
            }
        },
        password: {
            type: String,
            required: [true, 'Password must be informed.'],
            trim: true,
            minLength: 7,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password is invalid.');
                }
            }
        },
        avatar: {
            type: Buffer
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
    const user = this;
    const { password, tokens, avatar, ...userObj } = user.toObject();
    return userObj;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: '7 days'
    });

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    // eslint-disable-next-line no-use-before-define
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login.');
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login.');
    }

    return user;
};

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }

    next();
});

userSchema.pre('deleteOne', { document: true }, async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = model('User', userSchema);

module.exports = User;
