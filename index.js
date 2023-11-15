const express = require("express");
let cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// cors
app.use(
  cors({
    otigin: [
      // "http://localhost:5173/"
      "https://service-master-9864e.web.app/",
      "https://service-master-9864e.firebaseapp.com/",
    ],
    credentials: true,
  })
);
app.use(cors());
app.use(express.json());

//8KfKU1cEyCXpXsAx
//serviceMaster

//******************************************************* */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r0kjzd3.mongodb.net/?retryWrites=true&w=majority`;

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

    const serviceCollection = client
      .db("serviceMasterDB")
      .collection("services");
    const bookingCollection = client
      .db("serviceMasterDB")
      .collection("bookings");
    const addService = client.db("serviceMasterDB").collection("addService");

    // -- 01

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // -- 02

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    // --03 add services
    app.post("/addservices", async (req, res) => {
      const newService = req.body;
      const result = await addService.insertOne(newService);
      res.send(result);
    });
    // -- 04 show service with query

    app.get("/showAddService", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const cursor = addService.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // -- 05

    app.delete("/showAddService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(id);
      const result = await addService.deleteOne(query);
      res.send(result);
    });

    app.get("/showAddService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log("id from ", id);
      const result = await addService.findOne(query);
      res.send(result);
    });

    // update add service
    app.put("/showAddService/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedService = req.body;
        console.log("updated", updatedService);
        const update = {
          $set: {
            Image: updatedService.pic,
            Name: updatedService.name,
            description: updatedService.description,
            serviceArea: updatedService.area,
            Price: updatedService.price,
          },
        };
        const result = await addService.updateOne(filter, update);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // -- 07 some bookings
    app.get("/bookings", async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    // -- 08

    app.post("/addbookings", async (req, res) => {
      const newBooking = req.body;
      console.log(newBooking);
      const result = await bookingCollection.insertOne(newBooking);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//******************************************************* */

app.get("/", (req, res) => {
  res.send("This is service sharing server site");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
