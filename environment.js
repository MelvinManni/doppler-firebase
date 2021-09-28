const functions = require("firebase-functions");

let config = process.env;
// use firebase config when deployed to firebase
const deployedToFirebase = process.env.NODE_ENV === "production";
if (deployedToFirebase) {
  config = functions.config().env;
}

module.exports = config;
