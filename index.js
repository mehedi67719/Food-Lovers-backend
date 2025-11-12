const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())


const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const db = client.db("FoodNetwork");
    const reviewcollection = db.collection('products')
    const foodlovercollection = db.collection('foodlovers')
    const favoritecollection = db.collection('favorite')

  
    app.get("/favorite", async (req, res) => {
      try {
        const favorite = favoritecollection.find()
        const result = await favorite.toArray()
        res.send(result)
      } catch (err) {
        console.error("Error fetching favorites:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.delete("/favorite/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await favoritecollection.deleteOne({ _id: new ObjectId(id) })
        res.send(result)
      } catch (err) {
        console.error("Error deleting favorite:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.post("/favoritepost", async (req, res) => {
      try {
        const favoritepost = req.body;
        const result = await favoritecollection.insertOne(favoritepost)
        res.send(result)
      } catch (err) {
        console.error("Error adding favorite:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

 
    app.get("/reviewproduct", async (req, res) => {
      try {
        const review = reviewcollection.find().sort({ rating: -1 }).limit(6);
        const result = await review.toArray();
        res.send(result)
      } catch (err) {
        console.error("Error fetching top reviews:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.get("/review", async (req, res) => {
      try {
        const review = reviewcollection.find().sort({ date: -1 });
        const result = await review.toArray();
        res.send(result)
      } catch (err) {
        console.error("Error fetching all reviews:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.get("/toprestaurants", async (req, res) => {
      try {
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
      } catch (err) {
        console.error("Error fetching top restaurants:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.get('/myreview', async (req, res) => {
      try {
        const email = req.query.email;
        const result = await reviewcollection.find({ userEmail: email }).toArray();
        res.send(result)
      } catch (err) {
        console.error("Error fetching user reviews:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.get("/review/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await reviewcollection.findOne({ _id: new ObjectId(id) })
        res.send(result)
      } catch (err) {
        console.error("Error fetching single review:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.get("/foodlover", async (req, res) => {
      try {
        const lovers = foodlovercollection.find().limit(4);
        const result = await lovers.toArray()
        res.send(result)
      } catch (err) {
        console.error("Error fetching food lovers:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.get("/search", async (req, res) => {
      try {
        const search = req.query.name;
        let query = {};
        if (search) {
          query = { name: { $regex: search, $options: "i" } };
        }
        const result = await reviewcollection.find(query).toArray();
        res.send(result)
      } catch (err) {
        console.error("Error searching reviews:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.delete("/review/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await reviewcollection.deleteOne({ _id: new ObjectId(id) })
        res.send(result)
      } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.put('/review/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updatedata = req.body;
        const result = await reviewcollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedata }
        )
        res.send(result)
      } catch (err) {
        console.error("Error updating review:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.post('/review', async (req, res) => {
      try {
        const product = req.body;
        const result = await reviewcollection.insertOne(product)
        res.send(result)
      } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    // await client.db("admin").command({ ping: 1 });
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
// module.exports = app;