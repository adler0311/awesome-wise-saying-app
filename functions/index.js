const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const { sendExpoPush } = require("./service");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

exports.scheduledFunction = functions.pubsub
  .schedule("every day 07:30")
  .onRun(context => {
    console.log("This will be run every 07:30 am.");
    sendExpoPush(db);
    return null;
  });

app.get("/", (_, res) => res.send("Hello World"));

app.post("/pushToken", async (req, res) => {
  console.log(req.body);
  if (!req.body.pushToken) {
    console.log("no push token: ", requ.body.pushToken);
    res.status(400).send();
  }

  const pushToken = req.body.pushToken;
  await admin
    .firestore()
    .collection("pushTokens")
    .doc(pushToken)
    .set({ pushToken });
  res.status(200).send();
});

exports.api = functions.https.onRequest(app);
