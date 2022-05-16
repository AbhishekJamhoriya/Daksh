import * as types from "../../types/actionTypes";

function AddSensor(sensor) {
  return { type: types.ADD_SENSOR, payload: sensor };
}
function ToggleEnabled(index) {
  return { type: types.TOGGLE_ENABLED, payload: index };
}

export { AddSensor, ToggleEnabled };
