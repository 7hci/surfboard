import { createAction } from 'redux-actions';

const SET_TASKS = 'SET_TASKS';
const UPDATE_TASK = 'UPDATE_TASK';

// ACTIONS
export const setTasks = createAction(SET_TASKS);
export const updateTask = createAction(UPDATE_TASK);

// REDUCER
export default (tasks = [], action) => {
  switch (action.type) {
    case SET_TASKS: return action.payload.map(task => Object.assign(task, { status: 'loading' }));
    case UPDATE_TASK: {
      const update = action.payload;
      const index = tasks.findIndex(task => update.task === task.name);
      const task = Object.assign({}, tasks[index], update);
      return tasks.slice(0, index).concat(task).concat(tasks.slice(index + 1, tasks.length));
    }
    default: return tasks;
  }
};
