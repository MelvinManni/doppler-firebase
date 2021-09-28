// import libraries
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const environments = require("./environment");
const {default: axios} = require("axios");
const cors = require("cors");

// initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);

// initialize express server
const app = express();

//  Automatically allow cross-origin requests
app.use(express.json()); //  used instead of body-parser
app.use(cors());
// initialize the database and the collection
const db = admin.firestore();

app.get("/", async function(req, res) {
  try {
    const {data} = await axios("https://ipgeolocation.abstractapi.com/v1/?api_key=" + environments.API_KEY);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/messages", async function(req, res) {
  try {
    const messages = [];
    const data = await db.collection("messages").get();
    data.forEach((doc) => {
      messages.push({
        name: doc.data().name,
        message: doc.data().message,
      });
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/", async function(req, res) {
  try {
    const {name, message} = req.body;
    await db.collection("messages").doc().set({name, message});
    res.status(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

exports.restApi = functions.https.onRequest(app);
