const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b8lgl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_ORDER}`);
  // add products
  app.post('/addProducts',(req, res)=>{
    const product = req.body;
    //console.log(product)
    // collection.insertOne(product)
    collection.insertMany(product)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })

  // fetching data
  app.get('/products',(req, res)=>{
    collection.find({})//.limit(20)
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  // one product fetching
  app.get('/product/:key',(req, res)=>{
    collection.find({key: req.params.key})
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })
  })

  // many keys fetching from body
  app.post('/productsByKeys',(req, res)=>{
    const productKeys = req.body;
    collection.find({key: {$in : productKeys}})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  // user order stored in database
  app.post('/addNewOrder',(req, res)=>{
    const order = req.body;
    //console.log(product)
    // collection.insertOne(product)
    orderCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
  })
  

}); // this is the end of client connection



app.listen(5000);