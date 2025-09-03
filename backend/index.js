const express = require('express')
const app = express()
const cors = require('cors') //fetch error resolve by cors
require("dotenv").config()
const port = process.env.PORT || 5000
const mongo=require("./db");
mongo();


console.log("Backend server starting up...");
const allowedOrigins = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',  // For local development
  'https://gofood-one.vercel.app'   // IMPORTANT: Replace with your actual Vercel URL
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    console.log("This is the origin:", origin);
    console.log(allowedOrigins.indexOf(origin))
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

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

app.listen(port, "0.0.0.0", () => {
  console.log(`app is running on port ${port}`)
});
