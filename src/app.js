require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const cors = require("cors");
const authRouter = require("./Auth/auth-router");

//Creates new application object that encapsulates the functionality of Express server.
const app = express();
//This is middleware that requests pass through
//on their way to the final handler
app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test",
  })
);
// app.use(validateBearerToken);

app.use(helmet());
app.use(cors());

console.log(process.env.API_TOKEN);

const cars = require("./cars-data.js");

app.use("/api/auth", authRouter);

app.use(function errorHandler(error, req, res, next){
  let response 
  if (NODE_ENV === 'product') {
    response = { error: 'Server error'}
  } else {
    console.error(error)
    response = { error: error.message, object:error}
  }
  res.status(500).json(response)
})



app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  console.log("validate bearer token middleware");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  //move to the next middleware
  next();
});

function handleGetCar(req, res) {
  const { search = "", sort } = req.query;

  if (sort) {
    if (!["model", "year", "VIN"].includes(sort)) {
      return res.status(400).send("Sort must be one of model or year or VIN");
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

// app.listen(8000, () => {
//   console.log("Express server is listening on port 8000!");
// });

module.exports = app
