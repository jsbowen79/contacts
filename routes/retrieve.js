const routes = require("express").Router(); 
const contactsController = require("../controllers/index.js"); 

console.log("in retrieve.js")
routes.get("/", (req, res) => {
    res.send("default route working")
}); 

routes.get("/retrieve", contactsController.retrieve);
 
module.exports = routes; 