const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
let cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

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
    // await client.connect();

    const serviceCollection = client
      .db("serviceMasterDB")
      .collection("services");
    const bookingCollection = client
      .db("serviceMasterDB")
      .collection("bookings");

    // -- 01 show all service

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // -- 02  show specific service from  all service

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    // --03 add services in all service database
    app.post("/addservices", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    // -- 04 show adding  service with query
    app.get("/showServices", async (req, res) => {
      console.log(req.query.userEmail);
      let query = {};
      if (req.query?.userEmail) {
        query = { userEmail: req.query.userEmail };
      }
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // -- 05 delete service from my service

    app.delete("/showAddService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(id);
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });

    // --06 show adding service by id

    app.get("/showAddService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log("id from ", id);
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    // --07  update add service
    app.put("/showAddService/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedService = req.body;
        console.log("updated", updatedService);
        const update = {
          $set: {
            serviceImage: updatedService.serviceImage,
            serviceName: updatedService.serviceName,
            serviceDescription: updatedService.serviceDescription,
            serviceArea: updatedService.serviceArea,
            servicePrice: updatedService.servicePrice,
          },
        };
        const result = await serviceCollection.updateOne(filter, update);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // -- 08 some bookings
    app.get("/bookings", async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    //--09 pending works
    app.get("/pendingBooking", async (req, res) => {
      console.log("pending here", req.query.serviceProviderEmail);

      let query = {};
      if (req.query?.serviceProviderEmail) {
        query = { serviceProviderEmail: req.query.serviceProviderEmail };
      }

      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    // -- 10

    app.post("/addbookings", async (req, res) => {
      const newBooking = req.body;
      console.log(newBooking);
      const result = await bookingCollection.insertOne(newBooking);
      res.send(result);
    });

    // --11 pending booking
    app.put("/pendingBooking/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      let updatePending = req.body;
      console.log("from update", id, updatePending.status);
      const updateDoc = {
        $set: {
          status: updatePending.status,
        },
      };
      const result = await bookingCollection.updateOne(filter, updateDoc);
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
