const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Please provide a comment'],
    },
    ticketId: {
        type: String,
    },
    userId: {
        type: String,
    }
},
{timestamps: true})

module.exports = mongoose.model('Comment', CommentSchema);