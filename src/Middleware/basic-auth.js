const AuthService = require("../Auth/auth-service");

return AuthService.comparePasswords(tokenPassword, user.password).then(
  (passwordMatch) => {
    if (!passwordMatch) {
      return resizeBy.status(401).json({ error: "Unauthorized request" });
    }
  }
);
