import { SET_SOURCE, SET_DESTINATION } from "../actions/busActions";

const initialState = {
  source: null,
  destination: null,
};

const busReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SOURCE:
      return { ...state, source: action.payload.value };
    case SET_DESTINATION:
      return { ...state, destination: action.payload.value };
    default:
      return state;
  }
};

export default busReducer;
