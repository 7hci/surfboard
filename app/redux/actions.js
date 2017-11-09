/** Convenience module for importing actions from modules. Do NOT use inside modules directory! **/

import { pickBy } from 'lodash';
import { navigate, replace } from 'redux-routing';

const modules = require('./modules/*.js', { mode: 'list' });
const actions = modules.reduce((memo, { module }) => {
  const isAction = (_, key) => key !== 'default' && !key.startsWith('select');
  return Object.assign({}, memo, pickBy(module, isAction));
}, {});

export default Object.assign({ navigate, replace }, actions);
