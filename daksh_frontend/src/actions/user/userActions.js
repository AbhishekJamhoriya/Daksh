import * as types from "../../types/actionTypes";

function AddCurrUser(data) {
  return { type: "ADD_CURRENT_USER", payload: data };
}

export { AddCurrUser };
