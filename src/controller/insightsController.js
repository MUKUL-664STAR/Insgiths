const axios = require('axios');
const cheerio = require('cheerio');
const Insight = require('../models/Insight');

// Helper function to fetch word count and media
async function fetchWebsiteDetails(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Count words
        const text = $('body').text();
        const wordCount = text.split(/\s+/).length;

        // Extract media (images/videos)
        const media = [];
        $('img').each((_, el) => media.push({ type: 'image', url: $(el).attr('src') }));
        $('video source').each((_, el) => media.push({ type: 'video', url: $(el).attr('src') }));

        return { wordCount, media };
    } catch (error) {
        throw new Error('Failed to fetch website details.');
    }
}

// POST /api/insights
exports.createInsight = async (req, res) => {
    const { url } = req.body;

    if (!url) return res.status(400).json({ message: 'URL is required.' });

    try {
        const { wordCount, media } = await fetchWebsiteDetails(url);

        const newInsight = new Insight({ url, wordCount, media });
        await newInsight.save();

        res.status(201).json(newInsight);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/insights
exports.getInsights = async (req, res) => {
    try {
        const insights = await Insight.find().sort({ createdAt: -1 });
        res.status(200).json(insights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/insights/:id
exports.deleteInsight = async (req, res) => {
    try {
        const { id } = req.params;
        await Insight.findByIdAndDelete(id);
        res.status(200).json({ message: 'Insight removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/insights/:id/favorite
exports.toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const insight = await Insight.findById(id);

        if (!insight) return res.status(404).json({ message: 'Insight not found.' });

        insight.isFavorite = !insight.isFavorite;
        await insight.save();

        res.status(200).json({ message: 'Favorite status updated.', insight });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
