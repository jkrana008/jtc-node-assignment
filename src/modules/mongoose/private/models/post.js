const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: String,
    content: String,
    votes: { type: Number, default: 0 }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});

module.exports = mongoose.model('Post', schema);
