import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const app = express();
const port = 3000;

// middleware
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m3lhrmy.mongodb.net/?appName=Cluster0`;
const uri = `mongodb://localhost:27017/`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollections = client.db("coffee-store").collection("coffee_collection");

    app.get("/", (req, res) => {
      res.send("Welcome to the Coffee Server");
    });

    app.get("/coffees", async(req, res) => {
      const cursor = coffeeCollections.find();
      // const allCoffees = [];
      // for await (const doc of cursor){
      //   allCoffees.push(doc)
      // }
       const allCoffees = await coffeeCollections.find().toArray();
      res.send(allCoffees)
    })
    
    app.get("/coffees/:id", async (req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollections.findOne(query);
      res.send(result);
    })

    app.post("/coffees", async(req, res) => {
      const doc = req.body;
      console.log(doc)
      const result = await coffeeCollections.insertOne(doc);
      res.send(result);

    });

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await coffeeCollections.deleteOne(query);
      if( result.deleteCount === 1){
        console.log("Successfully deleted one document.")
      }else{
        console.log("No documents matched the query. Deleted 0 documents")
      }
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`);
});
