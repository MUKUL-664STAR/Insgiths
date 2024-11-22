const express = require('express');
const { createInsight, getInsights, deleteInsight, toggleFavorite } = require('../controller/insightsController');

const router = express.Router();

router.post('/', createInsight);
router.get('/', getInsights); 
router.delete('/:id', deleteInsight); 
router.put('/:id/favorite', toggleFavorite);

module.exports = router;
