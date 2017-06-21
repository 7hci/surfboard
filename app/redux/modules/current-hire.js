import { createAction } from 'redux-actions';

const SET_CURRENT_HIRE = 'SET_CURRENT_HIRE';
const UPDATE_CURRENT_HIRE = 'UPDATE_CURRENT_HIRE';

// ACTIONS
export const setCurrentHire = createAction(SET_CURRENT_HIRE);
export const updateCurrentHire = createAction(UPDATE_CURRENT_HIRE);

// REDUCER
export default (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_HIRE: return action.payload;
    case UPDATE_CURRENT_HIRE: return Object.assign(state, action.payload);
    default: return state;
  }
};
