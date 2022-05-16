import * as types from "../../types/actionTypes";

const initialState = {
  isResetingPassword: false,
  err: null,
  resp_message: ""
};

let resp_message = "Password reset successfully.";

function resetPasswordReducer(state = initialState, action) {
  switch (action.type) {
    case types.IS_RESETING_PASSWORD:
      return { ...state, isResetingPassword: true, err: null };
    case types.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isResetingPassword: false,
        resp_message: resp_message
      };
    case types.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isResetingPassword: false,
        err: action.err,
        resp_message: ""
      };
    default:
      return state;
  }
}

export default resetPasswordReducer;
