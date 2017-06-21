import { createAction } from 'redux-actions';
import { status } from '../../constants';

const SET_ONBOARDING_PROGRESS = 'SET_ONBOARDING_PROGRESS';

// ACTIONS
export const setOnboardingProgress = createAction(SET_ONBOARDING_PROGRESS);

// REDUCER
export default (state = status.NOT_STARTED, action) => {
  switch (action.type) {
    case SET_ONBOARDING_PROGRESS: return action.payload;
    default: return state;
  }
};
