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
    const { id } = req.params; 
    console.log("id: ", id)
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
    
async function createContact(req, res) {
        
    const firstName = req.body.firstName || null;
    const lastName = req.body.lastName || null;
    const email = req.body.email || null;
    const favoriteColor = req.body.favoriteColor || null;
    const birthday = req.body.birthday || null; 
    console.log(firstName, lastName, email, favoriteColor, birthday)
        
        
    if (firstName && lastName && email && favoriteColor && birthday) {
        const entry = {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            favoriteColor : req.body.favoriteColor,
            birthday : req.body.birthday 
        }
        
        console.log("Entry: " ,entry); 
        await connectDB();
        const collection = db.collection("current");
        try {
            const result = await collection.insertOne(entry);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).send("Data not saved. There was an uploading error.  Try again. ")
        }
    }else {
        res.send("You must provide all information for the contact.  Please include firstName, lastName, email, favoriteColor, and birthday. ")
    }
    
}


async function updateContact(req, res) {
    const updates = { ...req.body }
    const { ObjectId } = require("mongodb"); 
        await connectDB();
        const collection = db.collection("current"); 
    const record = await collection.findOne({_id: new ObjectId(updates.id)});
    delete updates.id; 
    console.log("Record: ", record)
        if (record) {
            try {
                const result = await collection.updateOne({ _id: record._id },
                    { $set: updates })
                console.log("reached 1")
                ""; 
                console.log("reached 2")
                res.json(result); 
            } catch (error) {
                console.error(error); 
                res.status(500).send("Database error. Record not updated.  Please try again.")
                }
        } else {
            res.status(404).send("Record not found.  Try another ID.")
        }
}

async function deleteContact(req, res) {
    const { ObjectId } = require("mongodb");
    await connectDB();
    const collection = db.collection("current");
    const record = await collection.findOne({ _id: new ObjectId(req.params.id) });
    console.log("Record: ", record)
    if (record) {
        try {
            const result = collection.deleteOne({ _id: record._id });
            res.send("Contact Removed"); 
            
        } catch (error) {
            console.error(error);
            res
            .status(500)
            .send("Database error. Record not deleted.  Please try again.");
        }
    } else {
        res.status(404).send("Record not found.  Try another ID.");
    }
}
        

module.exports = { retrieve, createContact, updateContact, deleteContact }; 