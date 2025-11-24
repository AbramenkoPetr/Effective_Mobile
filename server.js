const express = require("express");
const cors = require("cors");
const fs = require('fs')
const db = require("./app/models");


const app = express();

var corsOptions = {
origin: "*"
  //origin: "http://localhost:4200"
	//origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {

  let filePath = "index.html";  
    // в качестве типа ответа устанавливаем html
    res.setHeader("Content-Type", "text/html; charset=utf-8;");
    fs.readFile(filePath, (error, data)=>{
        if(error){                              // если ошибка
            response.statusCode = 404;
            response.end("<h1>Resourse not found!</h1>");
        }   
        else{
            res.end(data);
        }
    });
});

//const app = express();
//app.use(...);
db.sequelize.sync();
require("./app/routes/user.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});