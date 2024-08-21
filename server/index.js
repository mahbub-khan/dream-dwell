const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SK);

// middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;

    next();
  });
};

const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    //All DB Collections
    const usersCollection = client.db("stay-vista").collection("users");

    const roomsCollection = client.db("stay-vista").collection("rooms");

    const bookingCollection = client.db("stay-vista").collection("bookings");

    //Role Verification Middlewares
    //For Admin
    const verifyAdmin = async (req, res, next) => {
      const user = req.user;
      const query = { email: user?.email };
      const result = await usersCollection.findOne(query);

      if (!result || result?.role !== "admin")
        return res.status(401).send({ message: "Unauthorized Access" });

      next();
    };

    //For Host
    const verifyHost = async (req, res, next) => {
      const user = req.user;
      const query = { email: user?.email };

      const result = await usersCollection.findOne(query);

      if (!result || result?.role !== "host")
        return res.status(401).send({ message: "Unauthorized Access" });

      next();
    };

    // auth related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      console.log("I need a new jwt", user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // Logout
    app.get("/logout", async (req, res) => {
      try {
        res
          .clearCookie("token", {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send({ success: true });
        console.log("Logout successful");
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // Save or modify user email, status in DB
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const isExist = await usersCollection.findOne(query);
      console.log("User found?----->", isExist);

      if (isExist) {
        if (user?.status === "Requested") {
          const result = await usersCollection.updateOne(
            query,
            {
              $set: user,
            },
            options
          );
          return res.send(result);
        } else {
          //user exists and no request sent to be a host
          return res.send(isExist);
        }
      }

      const result = await usersCollection.updateOne(
        query,
        {
          $set: { ...user, timestamp: Date.now() },
        },
        options
      );
      res.send(result);
    });

    //Get user role
    app.get("/user/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const result = await usersCollection.findOne({ email });
      res.send(result);
    });

    //Get all users
    app.get("/users", verifyToken, async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    //Update user role
    app.put("/users/update/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...user,
          timestamp: Date.now(),
        },
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    //All rooms related api
    //Get all rooms
    app.get("/rooms", async (req, res) => {
      const result = await roomsCollection.find().toArray();
      res.send(result);
    });

    //Get all rooms for host
    app.get("/rooms/:email", verifyToken, verifyHost, async (req, res) => {
      const email = req.params.email;
      const result = await roomsCollection
        .find({ "host.email": email })
        .toArray();
      res.send(result);
    });

    //Get single room
    app.get("/room/:id", async (req, res) => {
      const id = req.params.id;
      const result = await roomsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //Save a room in Database
    app.post("/room", verifyToken, async (req, res) => {
      const room = req.body;
      const result = await roomsCollection.insertOne(room);

      res.send(result);
    });

    //Update a room in DB - for host
    app.put("/rooms/:id", verifyToken, async (req, res) => {
      const room = req.body;
      const filter = { _id: new ObjectId(req.params.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: room,
      };
      const result = await roomsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //Delete a room from DB - for host
    app.delete("/rooms/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollection.deleteOne(query);
      res.send(result);
    });

    //All Booking related api

    //Get all bookings for guest
    app.get("/bookings", verifyToken, async (req, res) => {
      const email = req.query.email;

      if (!email) return res.send([]);

      const query = { "guest.email": email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    //Get all bookings for host
    app.get("/bookings/host", verifyToken, async (req, res) => {
      const email = req.query.email;

      if (!email) return res.send([]);

      const query = { host: email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    //Cancel/Delete Booking for a Guest
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    //Generate client secret for stripe payment
    app.post("/create-payment-intent", verifyToken, async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);

      if (!price || amount < 1) return;
      const { client_secret } = await stripe.paymentIntents.create({
        amount: amount,
        currency: "eur",
        payment_method_types: ["card"],
      });

      res.send({ clientSecret: client_secret });
    });

    //Save booking info in booking collection
    app.post("/bookings", verifyToken, async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      //Send confirmation email....

      res.send(result);
    });

    //Update room booking status
    app.patch("/rooms/status/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          booked: status,
        },
      };
      const result = await roomsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    //All Stat related API

    //Guest stat data
    app.get("/guest-stat", verifyToken, async (req, res) => {
      const { email } = req.user;

      const bookingsDetails = await bookingCollection
        .find(
          { "guest.email": email },
          {
            projection: {
              date: 1,
              price: 1,
            },
          }
        )
        .toArray();

      const chartData = bookingsDetails.map((data) => {
        const day = new Date(data.date).getDate();
        const month = new Date(data.date).getMonth() + 1;
        return [day + "/" + month, data.price];
      });

      chartData.splice(0, 0, ["Day", "Reservation"]);

      const { timestamp } = await usersCollection.findOne(
        { email },
        {
          projection: {
            timestamp: 1,
          },
        }
      );
      const totalSpent = bookingsDetails.reduce(
        (sum, data) => sum + data.price,
        0
      );
      res.send({
        bookingCount: bookingsDetails.length,
        chartData,
        guestSince: timestamp,
        totalSpent,
      });
    });

    // Host Statistics
    app.get("/host-stat", verifyToken, verifyHost, async (req, res) => {
      const { email } = req.user;

      const bookingsDetails = await bookingCollection
        .find(
          { host: email },
          {
            projection: {
              date: 1,
              price: 1,
            },
          }
        )
        .toArray();
      const roomCount = await roomsCollection.countDocuments({
        "host.email": email,
      });
      const totalSale = bookingsDetails.reduce(
        (sum, data) => sum + data.price,
        0
      );
      const chartData = bookingsDetails.map((data) => {
        const day = new Date(data.date).getDate();
        const month = new Date(data.date).getMonth() + 1;
        return [day + "/" + month, data.price];
      });

      chartData.splice(0, 0, ["Day", "Sale"]);

      const { timestamp } = await usersCollection.findOne(
        { email },
        {
          projection: {
            timestamp: 1,
          },
        }
      );
      res.send({
        totalSale,
        bookingCount: bookingsDetails.length,
        roomCount,
        chartData,
        hostSince: timestamp,
      });
    });

    //Admin Stat Data
    app.get("/admin-stat", verifyToken, verifyAdmin, async (req, res) => {
      const bookingDetails = await bookingCollection
        .find({}, { projection: { date: 1, price: 1 } })
        .toArray();

      const userCount = await usersCollection.countDocuments();
      const roomCount = await roomsCollection.countDocuments();

      const totalSale = bookingDetails.reduce(
        (sum, data) => sum + data.price,
        0
      );

      const chartData = bookingDetails.map((data) => {
        const day = new Date(data.date).getDate();
        const month = new Date(data.date).getMonth() + 1;
        return [day + "/" + month, data.price];
      });

      chartData.unshift(["Day", "Sale"]);
      res.send({
        totalSale,
        bookingCount: bookingDetails.length,
        userCount,
        roomCount,
        chartData,
      });
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

app.get("/", (req, res) => {
  res.send("Hello from DreamDwell Server..");
});

app.listen(port, () => {
  console.log(`DreamDwell is running on port ${port}`);
});
