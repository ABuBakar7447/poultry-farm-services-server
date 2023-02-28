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
    const reviewCollection = client.db('poultryFarm').collection('reviews')


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


    


    app.get('/reviews', async(req,res) =>{
      console.log(req.query)
      let query ={};
      if(req.query.service_id ){
        query = {
          service_id: req.query.service_id
         
        }
      }
      
      const cursor = reviewCollection.find(query);
      const myreview = await cursor.toArray();
      res.send(myreview);
    });


    //addign reviews or comment in database
    app.post('/reviews', async(req, res)=>{
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });


    app.get('/userreview', async(req,res) =>{
      console.log(req.query)
      let query ={};
      if(req.query.email){
        query = {
          email: req.query.email
        }
      }
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    //getting selecting review based on id
    app.get('/reviews/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const service = await reviewCollection.findOne(query);
      res.send(service);
    })




    //updating user review
    app.put('/reviews/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const userEdit = req.body;
      const option = {upsert: true}
      console.log(userEdit)
      const updateEdit = {
        $set: {
          service_name:userEdit.service_name,
          service_id:userEdit.service_id,
          user_name:userEdit.user_name,
          image_url:userEdit.image_url,
          rating:userEdit.rating,
          email:userEdit.email,
          comment:userEdit.comment,
        }
      }
      const result = await reviewCollection.updateOne(filter, updateEdit, option);
      res.send(result);
    })


    //deleting user review 
    app.delete('/reviews/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
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
