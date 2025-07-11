const express = require("express");
const router = express.Router();
const order = require("../model/Order");

router.post("/orderDetail", async (req, res) => {
    let data = req.body.order_data;
    await data.splice(0, 0, { order_date: req.body.order_date });

    let eid = await order.findOne({ email: req.body.email });

    if (eid === null) {
        try {
            await order
                .create({
                    email: req.body.email,
                    order_data: [data],
                })
                .then(()=>
                    res.json({
                        success: true,
                    })
                );
        } catch (error) {
            res.status("error").send(error.message);
        }
    }
    else{
        try {
            await order.findOneAndUpdate({email:req.body.email},
                {$push:{order_data:data}}).then(()=>{
                    res.json({
                        success:true,
                    })
                })
        } catch (error) {
            res.status("error").send(error.message);
        }
    }
});

router.post("/myorderDetail", async (req, res) => {
    try {
        let mydata =await order.findOne({'email':req.body.email})
        res.json({orderData:mydata})
    } catch (error) {
        res.status("error").send(error.message);
    }
})

module.exports = router;
