import { combineReducers } from 'redux';
import { createAction } from 'redux-actions';
import { status } from '../../constants';

const SET_PROGRESS = 'SET_PROGRESS';
const RESET_TASKS = 'RESET_TASKS';
const UPDATE_TASK = 'UPDATE_TASK';

const initialTasks = [
  {
    name: 'createContractorEmail',
    text: 'Add contractor to 7hci domain',
    status: 'loading'
  },
  {
    name: 'sendLoginEmail',
    text: 'E-mail credentials to contractor',
    status: 'loading'
  },
  {
    name: 'addAndShareDriveFolder',
    text: 'Add onboarding documents to contractor folder',
    status: 'loading'
  },
  {
    name: 'sendWelcomeEmail',
    text: 'Send welcome e-mail to contractor',
    status: 'loading'
  },
  {
    name: 'createTrelloBoard',
    text: 'Create Trello board for onboarding tasks',
    status: 'loading'
  },
  {
    name: 'inviteToSlack',
    text: 'Invite contractor to Slack',
    status: 'loading'
  },
  {
    name: 'addUserToClickTime',
    text: 'Add user to ClickTime',
    status: 'loading'
  }
];

// ACTIONS
export const setProgress = createAction(SET_PROGRESS);
export const resetTasks = createAction(RESET_TASKS);
export const updateTask = createAction(UPDATE_TASK);

// REDUCERS
const progressReducer = (state = status.NOT_STARTED, action) => {
  switch (action.type) {
    case SET_PROGRESS: return action.payload;
    default: return state;
  }
};
const tasksReducer = (tasks = initialTasks, action) => {
  switch (action.type) {
    case RESET_TASKS: return initialTasks;
    case UPDATE_TASK: {
      const update = action.payload;
      const index = tasks.findIndex(task => update.task === task.name);
      const task = Object.assign({}, tasks[index], update);
      return tasks.slice(0, index).concat(task).concat(tasks.slice(index + 1, tasks.length));
    }
    default: return tasks;
  }
};
export default combineReducers({ tasks: tasksReducer, progress: progressReducer });

// SELECTORS
export const selectProgress = state => state.onboarding.progress;
export const selectTasks = state => state.onboarding.tasks;
