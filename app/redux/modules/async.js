/** This module holds all async methods. While it dependens on several other modules for dispatch calls
 *  it also helps remove all depencies from those modules. Any changes to http or routing libraries will
 *  only impact this module! **/

import { replace } from 'redux-routing';
import { actions as formActions } from 'react-redux-form';
import PDFObject from 'pdfobject';
import { setNewHires } from './new-hires';
import { setCurrentHire, updateCurrentHire } from './current-hire';
import { setUploadMessage, setUploadImageSource } from './upload';
import { setTasks } from './tasks';
import { setSpinnerVisibility } from './spinner';

const headers = new Headers({ 'Content-Type': 'application/json' });

export const getNewHires = () => (dispatch) => {
  fetch('/onboard/newhire', { credentials: 'include' })
    .then(response => response.json(), (error) => {
      throw error;
    })
    .then((data) => {
      dispatch(setNewHires(data));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const getNewHire = id => (dispatch) => {
  fetch(`/talent/info/${id}`, { credentials: 'include' })
    .then(response => response.json(), (error) => {
      throw error;
    })
    .then((data) => {
      dispatch(setCurrentHire(data));
      dispatch(formActions.change('form.contractClient.firstName', data.firstName));
      dispatch(formActions.change('form.contractClient.lastName', data.lastName));
      dispatch(formActions.change('form.contractClient.email', data.email));
      // The below is necessary to allow submit without changing the fields after they are set
      dispatch(formActions.setValidity('form.contractClient.firstName', true));
      dispatch(formActions.setValidity('form.contractClient.lastName', true));
      dispatch(formActions.setValidity('form.contractClient.email', true));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const addNewHire = formData => (dispatch) => {
  const body = JSON.stringify(formData);
  fetch('/onboard/add', { method: 'POST', credentials: 'include', body, headers })
    .then(response => response.json(), (error) => { throw error; })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      dispatch(setCurrentHire({ id: data.newHire.id }));
      dispatch(replace('/admin/2'));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const skipStep = (step, id) => (dispatch) => {
  fetch(`/onboard/skip?to=${step}&id=${id}`, { method: 'POST', credentials: 'include' })
    .then(response => response.json(), (error) => { throw error; })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      dispatch(replace(`/admin/${step}`));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const sendContract = (formData, id) => (dispatch) => {
  const body = JSON.stringify(formData);
  fetch(`/onboard/contract/send?id=${id}`, { method: 'POST', credentials: 'include', body, headers })
    .then(response => response.json(), (error) => { throw error; })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      dispatch(replace('/admin/3'));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const previewContract = (formData, newHire) => (dispatch) => {
  const body = JSON.stringify({ formData, newHire });
  dispatch(setSpinnerVisibility(true));
  fetch('/talent/contract/preview', { method: 'POST', credentials: 'include', body, headers })
    .then(response => response.json(), (error) => { throw error; })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      const info = { contractId: data.contractId, credentials: { access_token: data.accessToken } };
      dispatch(updateCurrentHire(info));
      dispatch(setSpinnerVisibility(false));
      dispatch(replace('/talent/preview'));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
      dispatch(setSpinnerVisibility(false));
    });
};
export const signContract = id => (dispatch) => {
  fetch(`/talent/contract/submit?id=${id}`, { method: 'POST', credentials: 'include', headers })
    .then(response => response.json(), (error) => { throw error; })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      dispatch(replace('/talent/4'));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const acceptContract = id => (dispatch) => {
  fetch(`/onboard/contract/accept?id=${id}`, { method: 'POST', credentials: 'include', headers })
    .then(response => response.json(), (error) => { throw error; })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      dispatch(replace('/admin/5'));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const getTasks = () => (dispatch) => {
  fetch('/onboard/tasks', { credentials: 'include' })
    .then(response => response.json(), (error) => {
      throw error;
    })
    .then((data) => {
      dispatch(setTasks(data));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const startOnboarding = (socket, formData, id) => () => {
  fetch('/credentials', { credentials: 'include' })
    .then(response => response.json(), (error) => {
      throw error;
    })
    .then((credentials) => {
      socket.emit('onboard', formData, id, credentials);
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const completeHire = id => (dispatch) => {
  fetch(`/onboard/complete?id=${id}`, { method: 'POST', credentials: 'include' })
    .then(response => response.json(), (error) => { throw error; })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      dispatch(replace('/admin'));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const embedPDFAdmin = id => () => {
  Promise.all([
    fetch('/credentials', { credentials: 'include' }),
    fetch(`/onboard/newhire/${id}`, { credentials: 'include' })
  ]).then(responses => Promise.all([responses[0].json(), responses[1].json()]))
    .then(([{ access_token }, { contractId }]) => {
      // eslint-disable-next-line camelcase
      const url = `https://www.googleapis.com/drive/v3/files/${contractId}/export?access_token=${access_token}`
        + '&mimeType=application%2Fpdf';
      PDFObject.embed(url, '#content', { height: '100%' });
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const embedPDFClient = hire => () => {
  const url = `https://www.googleapis.com/drive/v3/files/${hire.contractId}/export`
    + `?access_token=${hire.credentials.access_token}&mimeType=application%2Fpdf`;
  PDFObject.embed(url, '#content', { height: '100%' });
};
export const uploadDrawnSignature = (blob, id) => (dispatch) => {
  const body = new FormData();
  body.append(id, blob);
  fetch('/talent/contract/upload', { method: 'POST', credentials: 'include', body })
    .then(response => response.json(), (error) => { throw error; })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      dispatch(replace('/talent'));
      dispatch(setUploadImageSource(`/upload/${id}.bmp?${Date.now()}`));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
    });
};
export const uploadFileSignature = (file, id) => (dispatch) => {
  const body = new FormData();
  body.append(id, file);
  dispatch(setUploadMessage(1));
  dispatch(setSpinnerVisibility(true));
  fetch('/talent/contract/upload', { method: 'POST', credentials: 'include', body })
    .then(response => response.json(), (error) => { throw error; })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      dispatch(setUploadImageSource(`/upload/${id}.bmp?${Date.now()}`));
      dispatch(setUploadMessage(2));
      dispatch(setSpinnerVisibility(false));
    })
    .catch((err) => {
      console.log('An error occured:', err.message);
      dispatch(setUploadMessage(3));
      dispatch(setSpinnerVisibility(false));
    });
};
