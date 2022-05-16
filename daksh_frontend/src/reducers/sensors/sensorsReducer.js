const initialState = {};

function sensorReducer(state = initialState, action) {
  if (action.type == "FETCH_SENSORS") {
    return { ...state, ...action.payload };
  }
  return state;
}
export default sensorReducer;
