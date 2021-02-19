import AuthService from "./Auth/auth-service";
import config from "./config";

const AuthApiService = {
  postSignIn(credentials) {
    return fetch(`${config.API_ENDPOINT}/auth/signin`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(credentials),
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.rehect(e)) : res.json()
    );
  },
};

export default AuthApiService;