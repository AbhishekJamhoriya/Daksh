import * as types from "../../types/actionTypes";
import { backendUrl } from "../backendUrl";
import axios from "axios";

let url = process.env.REACT_APP_DEV_URL || backendUrl;

const isChangingPassword = () => ({ type: types.IS_CHANGING_PASSWORD });
const changePasswordSuccess = () => ({
  type: types.CHANGE_PASSWORD_SUCCESS
});
const changePasswordFailure = err => ({
  type: types.CHANGE_PASSWORD_FAILURE,
  err
});

function changePassword(pwDetails) {
  return async function(dispatch) {
    try {
      dispatch(isChangingPassword());
      let response = await axios.post(`${url}/auth/password/`, pwDetails, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("jwt_token")}`
        }
      })
      .catch((err) => console.log(err));
      if (!response) {
        throw new Error("Invalid credentials, please try again.");
      }
      return dispatch(changePasswordSuccess());
    } catch (err) {
      return dispatch(changePasswordFailure(err));
    }
  };
}

export { changePassword };
