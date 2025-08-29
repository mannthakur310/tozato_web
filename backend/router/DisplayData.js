const express = require("express");
const router = express.Router();

router.post('/foodData',(req,res)=>{
    try {
        console.log("API called - food_data length:", global.food_data?.length);
        console.log("API called - food_category length:", global.food_category?.length);
        console.log("Global food_data:", global.food_data);
        console.log("Global food_category:", global.food_category);
        
        if (!global.food_data || !global.food_category) {
            console.log("Global data not loaded yet, returning empty arrays");
            return res.send([[], []]);
        }
        
        res.send([global.food_data,global.food_category])
    } catch (error) {
        console.error(error.message);
        res.send('server error');
    }
})

module.exports = router;