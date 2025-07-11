const mongoose=require('mongoose')
const { MongoClient } = require("mongodb");
require('dotenv').config()
// const mongoURI =
//   "mongodb+srv://mannpratap310:putinbaba1@cluster0.73movqa.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster0"; //question mark se before database ka name 

  const connnectDB = async () => {
    try {
      await mongoose.connect(process.env.mongoURI, {
        bufferCommands: false, // Set to false to avoid buffering commands
      });
      console.log('MongoDB connected');
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
  const client =  new MongoClient(process.env.mongoURI);
    try {
      const db = client.db(dbName);
      const collection1 = db.collection(collectionName1);
      const collection2 = db.collection(collectionName2);

      const data1 = await collection1.find().toArray();
      const data2 = await collection2.find().toArray();

      global.food_data= data1;
      global.food_category=data2;
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      await client.close();
    }
  }
  fetchData();

};

module.exports = mongo;
