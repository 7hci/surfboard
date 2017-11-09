import { createAction } from 'redux-actions';

const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';

// ACTIONS
export const setActiveTab = createAction(SET_ACTIVE_TAB);

// REDUCERS
export default (state = 0, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB: return action.payload;
    default: return state;
  }
};

// SELECTORS
export const selectActiveTab = state => state.activeTab;
