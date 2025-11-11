const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const e = require('express');
const port = 3000


app.use(express.json());
app.use(cors())


const uri = "mongodb+srv://Local-Food-Lovers-Network:zXPo4GwxouyBxaFT@cluster0.jc6c5mw.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    await client.connect();

    const db=client.db("FoodNetwork");
    const reviewcollection=db.collection('products')
    const foodlovercollection=db.collection('foodlovers')
    const favoritecollection=db.collection('favorite')


    app.get("/favorite",async(req,res)=>{
      const favorite=favoritecollection.find()
      const result=await favorite.toArray()
      res.send(result)
      
    })

    app.delete("/favorite/:id",async(req,res)=>{
      const id=req.params.id;
      const result= await favoritecollection.deleteOne({_id:new ObjectId(id)})
      res.send(result)

      
    })

    app.post("/favoritepost",async(req,res)=>{
      const favoritepost=req.body;
      const result=await favoritecollection.insertOne(favoritepost)

      res.send(result)
      
    })


    app.get("/reviewproduct",async(req,res)=>{
        const review=  reviewcollection.find().sort({rating: -1}).limit(6);
        const result= await review.toArray();
        res.send(result)
        
    })

    app.get("/review", async (req,res)=>{
      const review = reviewcollection.find().sort({date: -1});
      const result = await review.toArray();
      res.send(result)
      
    })

app.get("/toprestaurants", async (req, res) => {

  const pipeline = [
    {
      $group: {
        _id: "$restaurant",
        totalReviews: { $sum: 1 },
        averageRating: { $avg: { $toDouble: "$rating" } },
        location: { $first: "$location" },
        image: { $first: "$image" }
      }
    },
    { $sort: { averageRating: -1, totalReviews: -1 } },
    { $limit: 4 }
  ];

  const result = await reviewcollection.aggregate(pipeline).toArray();
  res.send(result)
  
});



    app.get('/myreview',async(req,res)=>{
      const email=req.query.email;
      const result=await reviewcollection.find({userEmail: email}).toArray();
      res.send(result)
      
    })

    app.get("/review/:id" ,async(req,res)=>{
      const id=req.params.id;
      const result=await reviewcollection.findOne({_id:new ObjectId(id)})
      res.send(result)
      
    })


    app.get("/foodlover",async(req,res)=>{
      const lovers=foodlovercollection.find().limit(4);
      const result=await lovers.toArray()
      res.send(result)
      
    })


    app.get("/search",async(req,res)=>{
      const search=req.query.name;
      let query={};

      if(search){
        query={ name: { $regex: search, $options: "i" } }; 
      }
      const result=await reviewcollection.find(query).toArray();
      res.send(result)
    })

    app.delete("/review/:id",async(req,res)=>{
      const id=req.params.id;
      const result=await reviewcollection.deleteOne({ _id: new ObjectId(id) })
      res.send(result)
      
    })


    app.put('/review/:id' ,async(req,res)=>{
      const id =req.params.id;
      const updatedata=req.body;
      const result=await reviewcollection.updateOne(
        {_id: new ObjectId(id)},
      {$set: updatedata}
    )
    res.send(result)
    })

    app.post('/review' ,async(req,res)=>{
      const product=req.body;
      const result=await reviewcollection.insertOne(product)
      res.send(result)
    
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
