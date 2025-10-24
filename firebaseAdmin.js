const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json"); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://intelliprep-5b45f.firebaseio.com",
  });
}

const db = admin.firestore();

module.exports = { db };
