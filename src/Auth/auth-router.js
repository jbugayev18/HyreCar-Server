const express = require("express");
const AuthService = require("./auth-service");

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter.post("/signin", jsonBodyParser, (req, res, next) => {
  const { email, password } = req.body;
  const signInUser = { email, password };

  for (const [key, value] of Object.entries(signInUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key} in request body`,
      });
  res.send("ok");

  AuthService.getUserWithEmail(req.app.get("db"), signInUser.email)
    .then((dbUser) => {
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect email or password",
        });

      return AuthService.comparePasswords(
        signInUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: "Incorrect email or password",
          });
        const sub = dbUser.email;
        const payload = { email: dbUser.email };
        res.send({
          authToken: AuthService.createJwt(sub, payload),
        });
      });
    })
    .catch(next);
});

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

module.exports = authRouter;
