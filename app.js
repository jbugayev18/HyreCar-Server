const express = require("express");
const morgan = require("morgan");

//Creates new application object that encapsulates the functionality of Express server.
const app = express();
//This is middleware that requests pass through
//on their way to the final handler
app.use(morgan("common"));

const cars = require("./cars-data.js");

//This is the final request handler
app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/hello", (req, res) => {
  res.status(204).end();
});

app.get("/echo", (req, res) => {
  const responseText = `Here are some details of your request:
  ID: ${req.ID}
  Make: ${req.make}
  Model: ${req.model}
  Year: ${req.year}
  VIN" ${req.VIN}
  `;

  res.send(responseText);
});

app.get("/queryViewer", (req, res) => {
  console.log(req.query);
  res.end(); // does not send any data to the client
});

// app.get("/car"),
//   (req, res) => {
//     //1. get values from the request
//     const id = req.query.id;
//     const make = req.query.make;
//     const model = req.query.model;
//     const year = req.query.year;
//     const vin = req.query.vin;
//     //2. validate the values
//     if (!id) {
//       //3. id was not provided
//       return res.status(400).send("Please provide an ID");
//     }

//     if (!make) {
//       //3. make was not provided
//       return res.status(400).send("Please provide a make");
//     }

//     if (!model) {
//       //3. model was not provided
//       return res.status(400).send("Please provide a model");
//     }

//     if (!year) {
//       //3. year was not provided
//       return res.status(400).send("Please provide a year");
//     }

//     if (!vin) {
//       //3. vin was not provided
//       return res.status(400).send("Please provide a vin");
//     }

//     //4. If all values are valid
//     const registeredCar = `Your car: ${id}, ${make}, ${model}, ${year}, and ${vin} is successfully registered!`;

//     //5. send the response
//     res.send(registeredCar);
//   };

app.get("/greetings", (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;

  //2. validate the values
  if (!name) {
    //3. name was not provided
    return res.status(400).send("Please provide a name");
  }

  if (!race) {
    //3. race was not provided
    return res.status(400).send("Please provide a race");
  }

  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

  //6. send the response
  res.send(greeting);
});

// ACTUAL CODE FOR THIS PROJECT
app.get("/cars", (req, res) => {
  const { search = "", sort } = req.query;

  if (sort) {
    if (!["make"].includes(sort)) {
      return res.status(400).send("Sort must be make");
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
});

app.listen(8000, () => {
  console.log("Express server is listening on port 8000!");
});
