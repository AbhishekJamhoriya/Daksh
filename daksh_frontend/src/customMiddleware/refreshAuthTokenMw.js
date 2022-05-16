import { logoutAction } from "../actions/auth/authActions";
import jwtDecode from "jwt-decode";
import { backendUrl } from "../actions/backendUrl";
import * as types from "../types/actionTypes";
import { history } from "../index.js";

let url = process.env.REACT_APP_DEV_URL || backendUrl;

// Reads jwtToken from cookie and renews it or logs the user out.
function refreshAuthToken({ dispatch, getState }) {
  return (next) => (action) => {
    if (typeof action === "function" || action.type === types.REFRESH_TOKEN) {
      if (localStorage.getItem("jwt_token") && localStorage.length > 0) {
        const tokenExpiration = jwtDecode(localStorage.getItem("jwt_token")).exp;
        const currentTime = Math.round(new Date().getTime() / 1000);
        const timeLeft = tokenExpiration - currentTime;
        const loginToken = localStorage.getItem("jwt_token");
        if (tokenExpiration && timeLeft <= 0) {
          history.push("/login");
          localStorage.removeItem("jwt_token");
          dispatch(logoutAction());
          return next(action);
        }
        if (tokenExpiration && timeLeft <= 1800) {
          return fetch(`${url}/auth/jwt/refresh/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: loginToken,
            },
            body: JSON.stringify({ token: loginToken }),
          })
            .then((response) => response.json())
            .then((json) => {
              localStorage.setItem("jwt_token", json.token)
            })
            .then(() => next(action));
        }
        return next(action);
      }
      return next(action);
    } else {
      return next(action);
    }
  };
}

export default refreshAuthToken;
