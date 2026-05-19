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

const { ObjectId } = require("mongodb");
const NotFoundError = require('../errors/notFoundError'); 
const DatabaseError = require('../errors/databaseError');
const UserDataError = require('../errors/userDataError'); 

async function retrieve(req, res, next) {
    try {
    await connectDB();
    const collection = db.collection("current"); 
        const { id } = req.params;
        if (id) {
            
            if (ObjectId.isValid(id)) {
                const data = await collection.findOne({ _id: new ObjectId(id) });
                if (!data) {
                    throw new NotFoundError(`User ${id} does not exist in database`);
                };
                res.json(data);
            } else {
                throw new NotFoundError("Please ensure you entered a valid Mongo DB Id.");
            }
        }
                const data = await collection.find({}).toArray(); 
        if (data.length === 0) {
                    throw new NotFoundError("No contacts found in the database.")
                };
            res.json(data); 
        } catch (error) {
        next(error); 
    }
}
    
async function createContact(req, res) {
        
    const firstName = req.body.firstName || null;
    const lastName = req.body.lastName || null;
    const email = req.body.email || null;
    const favoriteColor = req.body.favoriteColor || null;
    const birthday = req.body.birthday || null; 
        
        
    if (firstName && lastName && email && favoriteColor && birthday) {
        const entry = {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            favoriteColor : req.body.favoriteColor,
            birthday : req.body.birthday 
        }
        
        await connectDB();
        const collection = db.collection("current");
        try {
            const result = await collection.insertOne(entry);
            res.json(result);
        } catch (error) {
            console.error(error);
            throw new DatabaseError("Data not saved. There was an uploading error.  Try again. ")
        }
    }else {
        throw new UserDataError("You must provide all information for the contact.  Please include firstName, lastName, email, favoriteColor, and birthday. ")
    }
    
}


async function updateContact(req, res) {
    const updates = { ...req.body }
    const { ObjectId } = require("mongodb"); 
    await connectDB();
    const collection = db.collection("current"); 
    if (ObjectId.isValid(updates.id)) {
        
        
        const record = await collection.findOne({_id: new ObjectId(updates.id)});
        delete updates.id; 
        console.log("Record: ", record)
        if (record) {
            try {
                const result = await collection.updateOne({ _id: record._id },
                    { $set: updates })
                    res.json(result); 
                } catch (error) {
                    console.error(error); 
                    throw new DatabaseError("Database error. Record not updated.  Please try again.")
                }
            } else {
                throw new NotFoundError("Record not found.  Try another ID.")
            }
    } else {
        throw new NotFoundError("Please enter a valid MondoDB Id.")
        }
}

async function deleteContact(req, res) {
    const { ObjectId } = require("mongodb");
    await connectDB();
    const collection = db.collection("current");
    if (ObjectId.isValid(req.params.id)) {
        
        
        const record = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if (record) {
            try {
                const result = collection.deleteOne({ _id: record._id });
                res.send("Contact Removed"); 
                
            } catch (error) {
                throw new DatabaseError("Database error. Record not deleted.  Please try again.");
            }
        } else {
            throw new NotFoundError("Record not found.  Try another ID.");
        }
    } else throw new NotFoundError("Please enter a valid MongoDB Id.")
}
        

module.exports = { retrieve, createContact, updateContact, deleteContact }; 