const express = require("express"); 
const app = express(); 
const route = require("./routes/index.js");
const port = process.env.PORT || 3000; 
const swaggerUI = require('swagger-ui-express'); 
const swaggerDocument = require('./swagger-output.json'); 

//middleware
app.use(express.json()); 

//routes
app.use("/contacts", route); 
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument)); 

//start server
app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
}); 

module.exports = { app }; 





