const routes = require("express").Router();
const contactsController = require("../controllers/index.js");
const { validContactRules, validateNew, changeContactRules, validateChange } = require('./validator.js');
const asyncHandler = require('../errors/asyncHandler.js'); 

console.log("in routes")
routes.get("/", asyncHandler(contactsController.retrieve))
routes.get("/:id", asyncHandler(contactsController.retrieve));
routes.post("/",validContactRules(), validateNew, asyncHandler(contactsController.createContact)); 
routes.put("/", changeContactRules(), validateChange, asyncHandler(contactsController.updateContact)); 
routes.delete("/:id", asyncHandler(contactsController.deleteContact)); 

module.exports = routes;
