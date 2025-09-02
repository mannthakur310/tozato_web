const express = require("express");
const router = express.Router();

router.post('/foodData',(req,res)=>{
    try {
        if (!global.food_data || !global.food_category) {
            return res.send([[], []]);
        }
        
        res.send([global.food_data,global.food_category])
    } catch (error) {
        console.error(error.message);
        res.send('server error');
    }
})

module.exports = router;

