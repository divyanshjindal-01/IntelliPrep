const admin = require("firebase-admin");
const path = require("path"); // ⬅️ NEW: Import the path module

// Use path.join to create a path that is RELATIVE TO THIS FILE'S directory (__dirname)
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// ⬅️ NOTE: You must use the serviceAccountPath variable here 
// The require() function loads the JSON file content from the absolute path
const serviceAccount = require(serviceAccountPath); 
console.log("using service Account Path",serviceAccountPath)
if (!admin.apps.length) {
 admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 databaseURL: "https://intelliprep-5b45f.firebaseio.com",
 });
}

const db = admin.firestore();

module.exports = { db };