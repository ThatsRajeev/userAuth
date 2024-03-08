const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    id: Number, 
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: String, 
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Post', postSchema);
