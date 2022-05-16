import { combineReducers } from "redux";

import authReducer from "./auth/authReducer";
import changePasswordReducer from "./auth/changePasswordReducer";
import sensorReducer from "./sensors/sensorsReducer";
import currUserReducer from "./user/currUserReducer";
const rootReducer = combineReducers({
  auth: authReducer,
  change_password: changePasswordReducer,
  sensor: sensorReducer,
  curr_user: currUserReducer,
});

export default rootReducer;
