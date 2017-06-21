/** Convenience module for importing actions from modules. Do NOT use inside modules directory! **/

import { navigate, replace } from 'redux-routing';
import * as newHires from './modules/new-hires';
import * as hire from './modules/current-hire';
import * as progress from './modules/onboarding-progress';
import * as spinner from './modules/spinner';
import * as tasks from './modules/tasks';
import * as async from './modules/async';
import * as tab from './modules/active-tab';
import * as sig from './modules/signature';
import * as upload from './modules/upload';

export default Object.assign({ navigate, replace }, newHires, hire, progress, spinner, tasks, tab, sig, upload, async);
