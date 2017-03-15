import { combineReducers } from "redux";


export function dumb(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}
// http://redux.js.org/docs/basics/Reducers.html#splitting-reducers
export default combineReducers({ dumb });

