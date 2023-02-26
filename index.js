const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId,} = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ekuronr.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const servicesCollection = client.db('poultryFarm').collection('services')


    app.get('/limitedService', async(req,res) =>{
      const query ={}
      const cursor = servicesCollection.find(query).sort({ "_id": -1 }).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });


    app.get('/allServices', async(req,res) =>{
      const query ={}
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });


    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id;

      const query = {_id: new ObjectId(id)};
      const serviceDetails = await servicesCollection.findOne(query);
      res.send(serviceDetails)
      // const query = {_id: ObjectId(id)}
      // const service = await servicesCollection.findOne(query);
      // res.send(service);
    })


     
  }
  finally{

  }
}

run().catch(err => console.error(err))

app.get('/', (req, res) =>{
    res.send('Poultry Server is running');

})

app.listen(port, () =>{
    console.log(`Poultry server is running on ${port}`)
})
