const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Conversation", ConversationSchema);