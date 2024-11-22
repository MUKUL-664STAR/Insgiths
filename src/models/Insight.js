const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
    url: { type: String, required: true },
    wordCount: { type: Number, required: true },
    media: [
        {
            type: { type: String, enum: ['image', 'video'], required: true },
            url: { type: String, required: true }
        }
    ],
    isFavorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Insight', insightSchema);
