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

  AuthService.getUserWithEmail(req.app.get("db"), signInUser.email)
    .then((dbUser) => {
      console.log({ dbUser });
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect email or password",
        });

      return AuthService.comparePasswords(
        signInUser.password,
        dbUser.password
      ).then((compareMatch) => {
        console.log({ compareMatch });
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

module.exports = authRouter;
