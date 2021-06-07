const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide a email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        required: [true, 'Please provide a user role'],
    },
},
{timestamps: true})

module.exports = mongoose.model('User', UserSchema);