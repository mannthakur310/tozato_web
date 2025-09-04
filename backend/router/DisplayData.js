const express = require("express");
const router = express.Router();

const { getFoodData } = require('../cache/foodCache');

router.get('/foodData', (req, res) => {
    try {
        // db.js populates global.food_data and global.food_category
        const { items, categories } = getFoodData();
        if (Array.isArray(items) && Array.isArray(categories)) {
            // console.log('Serving food data from cache:', items.length, 'items;', categories.length, 'categories');
            // return a JSON object with named fields for clarity on the client
            return res.status(200).json({ items, categories });
        }

        // If globals are not yet populated, return empty arrays (200) and log a warning
        console.warn('Cache empty — returning empty arrays.');
        return res.json({ items: [], categories: [] });
    } catch (error) {
        console.error('Error in /foodData handler:', error);
        return res.status(500).json({ error: 'Server Error' });
    }
});
    
    module.exports = router;

