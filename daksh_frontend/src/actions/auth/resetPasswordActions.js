import * as types from "../../types/actionTypes";
import { backendUrl } from "../backendUrl";
import axios from "axios";

let url = process.env.REACT_APP_DEV_URL || backendUrl;

const isResetingPassword = () => ({ type: types.IS_RESETING_PASSWORD });
const resetPasswordSuccess = () => ({
  type: types.RESET_PASSWORD_SUCCESS
});
const resetPasswordFailure = err => ({
  type: types.RESET_PASSWORD_FAILURE,
  err
});

function resetPassword(pwDetails) {
  return async function(dispatch) {
    try {
      dispatch(isResetingPassword());
      let response = await axios.post(`${url}/auth/resetpassword/`, pwDetails, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("jwt_token")}`
        },
      })
      .catch((err) => console.log(err));
      if (!response.ok) {
        throw new Error("Invalid credentials, please try again.");
      }
      return dispatch(resetPasswordSuccess());
    } catch (err) {
      return dispatch(resetPasswordFailure(err));
    }
  };
}

export { resetPassword };
