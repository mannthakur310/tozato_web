const express = require('express')
const app = express()
const cors = require('cors') //fetch error resolve by cors
require("dotenv").config()
const port = process.env.PORT || 5000
const mongo=require("./db");
mongo();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Test endpoint to check if global data is loaded
app.get('/api/test', (req, res) => {
  res.json({
    foodDataLength: global.food_data?.length || 0,
    foodCategoryLength: global.food_category?.length || 0,
    foodData: global.food_data?.slice(0, 2) || [], // First 2 items for testing
    foodCategory: global.food_category?.slice(0, 2) || [] // First 2 items for testing
  });
});

app.use(express.json());

app.use('/api', require('./router/CreateUser'));
app.use('/api', require('./router/DisplayData'));
app.use('/api', require('./router/OrderDetail'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

