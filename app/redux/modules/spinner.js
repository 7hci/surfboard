import { createAction } from 'redux-actions';

const SET_SPINNER_VISIBILITY = 'SET_SPINNER_VISIBILITY';

// ACTIONS
export const setSpinnerVisibility = createAction(SET_SPINNER_VISIBILITY);

// REDUCER
export default (state = false, action) => {
  switch (action.type) {
    case SET_SPINNER_VISIBILITY: return action.payload;
    default: return state;
  }
};
