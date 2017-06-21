import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';

const SET_UPLOAD_MESSAGE = 'SET_UPLOAD_MESSAGE';
const SET_IMG_SRC = 'SET_IMG_SRC';

// ACTIONS
export const setUploadMessage = createAction(SET_UPLOAD_MESSAGE);
export const setUploadImageSource = createAction(SET_IMG_SRC);

// REDUCERS
const messageReducer = (state = 0, action) => {
  switch (action.type) {
    case SET_UPLOAD_MESSAGE: return action.payload;
    default: return state;
  }
};
const srcReducer = (state = 'img/placeholder.png', action) => {
  switch (action.type) {
    case SET_IMG_SRC: return action.payload;
    default: return state;
  }
};
export default combineReducers({ message: messageReducer, src: srcReducer });

