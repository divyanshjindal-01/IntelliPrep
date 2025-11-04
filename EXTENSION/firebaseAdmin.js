const admin = require("firebase-admin");
const path = require("path"); // ⬅️ NEW: Import the path module

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

const serviceAccount = require(serviceAccountPath); 
console.log("using service Account Path",serviceAccountPath)
console.log("Using Service Account Path:", serviceAccountPath);


if (!admin.apps.length) {
 admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 databaseURL: "https://intelliprep-5b45f.firebaseio.com",
 });
}

const db = admin.firestore();

module.exports = { db };