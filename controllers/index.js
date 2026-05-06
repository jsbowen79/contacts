const { MongoClient } = require("mongodb"); 
require("dotenv").config();
const client = new MongoClient(process.env.MONGO_URI); 
let db; 

async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db("Contacts");
        console.log("Connected to MongoDB")
    }
}   


async function retrieve(req, res) {
    await connectDB();
    const { ObjectId } = require("mongodb"); 
    const collection = db.collection("current"); 
    const { id } = req.query; 
    console.log(id); 
        
        try {
            if (id) {
                const data = await collection.findOne({_id : new ObjectId(id) }); 
                res.json(data); 
            } else {
                const data = await collection.find({}).toArray(); 
                res.json(data); 
            }
        } catch (error) {
            console.error(error); 
            res.status(500).send("Error fetching Data");
        }
    }

module.exports = { retrieve }; 