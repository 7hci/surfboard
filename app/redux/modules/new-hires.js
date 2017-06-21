import { createAction } from 'redux-actions';

const SET_NEW_HIRES = 'UPDATE_NEW_HIRES';

// ACTIONS
export const setNewHires = createAction(SET_NEW_HIRES);

// REDUCER
export default (state = [], action) => {
  switch (action.type) {
    case SET_NEW_HIRES: return action.payload;
    default: return state;
  }
};
