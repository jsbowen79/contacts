const routes = require("express").Router();
const contactsController = require("../controllers/index.js");

console.log("in routes")
routes.get("/", contactsController.retrieve)
routes.get("/:id", contactsController.retrieve);
routes.post("/", contactsController.createContact); 
routes.put("/", contactsController.updateContact); 
routes.delete("/:id", contactsController.deleteContact); 

module.exports = routes;
