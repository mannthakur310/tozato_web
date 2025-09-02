const mongoose=require('mongoose')
const { MongoClient } = require("mongodb");
require('dotenv').config()

// Connection string (uses .env if set, falls back to local dev)
const mongoURI = process.env.mongoURI;

  const connnectDB = async () => {
    try {
      await mongoose.connect(mongoURI, {
        bufferCommands: false, // Set to false to avoid buffering commands
      });
      console.info('MongoDB connected');
    } catch (err) {
      console.error('Error connecting to MongoDB', err);
      process.exit(1); 
    }
  };
  

  const mongo= async()=>{
  await connnectDB();
  const dbName = "gofoodmern";
  const collectionName1 = "food_data";
  const collectionName2= "food_category";

  async function fetchData() {
  const client =  new MongoClient(mongoURI);
    try {
      
      const db = client.db(dbName);
      const collection1 = db.collection(collectionName1);
      const collection2 = db.collection(collectionName2);

      const data1 = await collection1.find().toArray();
      const data2 = await collection2.find().toArray();

      
      
      global.food_data= data1;
      global.food_category=data2;
      
      
    } catch (error) {
      console.error("Error fetching data:", error);
      // Initialize with empty arrays if there's an error
      global.food_data = [];
      global.food_category = [];
    } finally {
      await client.close();
    }
  }
  fetchData();

};

module.exports = mongo;


