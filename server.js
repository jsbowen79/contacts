const express = require("express"); 
const app = express(); 
const retrieveRoute = require("./routes/retrieve.js");
const port = process.env.PORT || 3000; 

console.log("in server.js"); 


//routes
app.use("/", retrieveRoute); 

//start server
app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
}); 

module.exports = { app }; 





