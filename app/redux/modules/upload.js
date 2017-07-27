import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';

const SET_UPLOAD_MESSAGE = 'SET_UPLOAD_MESSAGE';
const SET_IMG_URL = 'SET_IMG_URL';

// ACTIONS
export const setUploadMessage = createAction(SET_UPLOAD_MESSAGE);
export const setUploadImageUrl = createAction(SET_IMG_URL);

// REDUCERS
const messageReducer = (state = 0, action) => {
  switch (action.type) {
    case SET_UPLOAD_MESSAGE: return action.payload;
    default: return state;
  }
};
const urlReducer = (state = 'img/placeholder.png', action) => {
  switch (action.type) {
    case SET_IMG_URL: return action.payload;
    default: return state;
  }
};
export default combineReducers({ message: messageReducer, url: urlReducer });

// SELECTORS
export const selectUploadMessage = state => state.upload.message;
export const selectUploadUrl = state => state.upload.url;
