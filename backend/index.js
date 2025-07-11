const express = require('express')
const app = express()
const cors = require('cors') //fetch error resolve by cors
require("dotenv").config()
const port = process.env.PORT
const mongo=require("./db");
mongo();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());

app.use('/api', require('./router/CreateUser'));
app.use('/api', require('./router/DisplayData'));
app.use('/api', require('./router/OrderDetail'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

