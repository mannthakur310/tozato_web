const express = require("express");
const router = express.Router();

router.post('/foodData',(req,res)=>{
    try {
        if (global.food_items && global.foodCategory) {
            res.send([global.food_items, global.foodCategory]);
        } else {
            res.status(404).send("Food data not found.");
        }
        } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
        }
    });
    
    module.exports = router;

