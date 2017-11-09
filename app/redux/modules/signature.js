import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';

const SET_SIGNATURE_DATA = 'SET_SIGNATURE_DATA';
const CLEAR_SIGNATURE = 'CLEAR_SIGNATURE';

// ACTIONS
export const setSignatureData = createAction(SET_SIGNATURE_DATA);
export const clearSignature = createAction(CLEAR_SIGNATURE);

// REDUCERS
const dataReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SIGNATURE_DATA: return action.payload;
    default: return state;
  }
};
const clearReducer = (state = false, action) => {
  switch (action.type) {
    case CLEAR_SIGNATURE: return Date.now();
    default: return state;
  }
};
export default combineReducers({ data: dataReducer, clear: clearReducer });

// SELECTORS
export const selectSignatureData = state => state.signature.data;
export const selectSignatureClear = state => state.signature.clear;
