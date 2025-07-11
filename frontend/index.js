const express = require('express')
const app = express()
const cors=require('cors') //fetch error resolve by cors
const port = 5000
const mongo=require("./my-app/backend/db");
mongo();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());

app.use('/api', require('./my-app/backend/router/CreateUser'));
app.use('/api', require('./my-app/backend/router/DisplayData'));
app.use('/api', require('./my-app/backend/router/OrderDetail'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

