import { camelCase } from 'lodash';

const modules = require('./modules/*.js', { mode: 'list' });
const reducers = modules.reduce((memo, { module, name }) => {
  const defaultExport = module.default;
  return defaultExport ? Object.assign({}, memo, { [camelCase(name)]: defaultExport }) : memo;
}, {});

export default reducers;
