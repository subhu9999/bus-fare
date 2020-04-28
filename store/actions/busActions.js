export const SET_SOURCE = "SET_SOURCE";
export const SET_DESTINATION = "SET_DESTINATION";

export const setSource = value => {
    return {
      type: SET_SOURCE,
      payload: { value }
    };
  };
  
  export const setDestination = value => {
    return {
      type: SET_DESTINATION,
      payload: { value }
    };
  };