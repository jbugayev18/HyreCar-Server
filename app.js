require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

//Creates new application object that encapsulates the functionality of Express server.
const app = express();
//This is middleware that requests pass through
//on their way to the final handler
app.use(morgan("dev"));
app.use(validateBearerToken);

app.use(cors());

console.log(process.env.API_TOKEN);

const cars = require("./cars-data.js");

//This is the final request handler
// app.get("/", (req, res) => {
//   res.send("Hello Express");
// });

// app.get("/hello", (req, res) => {
//   res.status(204).end();
// });

// app.get("/echo", (req, res) => {
//   const responseText = `Here are some details of your request:
//   ID: ${req.ID}
//   Make: ${req.make}
//   Model: ${req.model}
//   Year: ${req.year}
//   VIN" ${req.VIN}
//   `;

//   res.send(responseText);
// });

// app.get("/queryViewer", (req, res) => {
//   console.log(req.query);
//   res.end(); // does not send any data to the client
// });

// app.get("/greetings", (req, res) => {
//   //1. get values from the request
//   const name = req.query.name;
//   const race = req.query.race;

//   //2. validate the values
//   if (!name) {
//     //3. name was not provided
//     return res.status(400).send("Please provide a name");
//   }

//   if (!race) {
//     //3. race was not provided
//     return res.status(400).send("Please provide a race");
//   }

//   //4. and 5. both name and race are valid so do the processing.
//   const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

//   //6. send the response
//   res.send(greeting);
// });

// ACTUAL CODE FOR THIS PROJECT
app.use(function validateBearerToken(req, res, next) {
  const bearerToken = req.get("Authorization").split(" ")[1];
  const apiToken = process.env.API_TOKEN;
  console.log("validate bearer token middleware");

  if (bearerToken !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  //move to the next middleware
  next();
});

function handleGetCar(req, res) {
  const { search = "", sort } = req.query;

  if (sort) {
    if (!["model", "year", "VIN"].includes(sort)) {
      return res.status(400).send("Sort must be one of model or year or VPN");
    }
  }

  //We will filter through cars to find a car of a certain make.
  //Search is case insensitive
  let results = cars.filter((car) =>
    car.make.toLowerCase().includes(search.toLowerCase())
  );

  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  res.json(results);
}

app.get("/cars", handleGetCar);

app.listen(8000, () => {
  console.log("Express server is listening on port 8000!");
});
