/** Convenience module for importing selectors from modules. **/

import { pickBy } from 'lodash';
import { navigate, replace } from 'redux-routing';

const modules = require('./modules/*.js', { mode: 'list' });
const actions = modules.reduce((memo, { module }) => {
  const isSelector = (_, key) => key !== 'default' && key.startsWith('select');
  return Object.assign({}, memo, pickBy(module, isSelector));
}, {});

export default Object.assign({ navigate, replace }, actions);
