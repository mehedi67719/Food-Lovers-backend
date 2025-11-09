const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

    app.get("/reviewproduct",async(req,res)=>{
        const review=  reviewcollection.find().sort({rating: -1}).limit(6);
        const result= await review.toArray();
        res.send(result)
    })

 app.get("/product", async (req, res) => {
  try {
    const search = req.query.search || ""; 
    const result = await reviewcollection
      .find({ name: { $regex: search, $options: "i" } }) 
      .sort({ date: -1 }) 
      .toArray();

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

    app.post('/product' ,async(req,res)=>{
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
