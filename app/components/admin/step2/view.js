import React from 'react';
import { Control } from 'react-redux-form';
import { Page, InputGroupText } from '../../shared/index';

const Step2 = (props) => {
  const { handleClickSkip, handleSubmit } = props;
  return (
    <Page
      model="form.contractAdmin"
      content={
        <div className="card-block">
          <div className="form-group">
            <label className="input-group-label" htmlFor="form.contractAdmin.message">
              <span>Custom Message</span>
              <Control.textarea className="form-control" model="form.contractAdmin.message" rows="7" required />
            </label>
          </div>
          <InputGroupText model="form.contractAdmin.cc" label="CC (Optional)" type="email" required={false} />
        </div>
      }
      buttons={
        <div>
          <button className="btn btn-secondary" type="button" onClick={handleClickSkip}>Skip</button>
          &nbsp;
          <input className="btn btn-success" type="submit" value="Send" />
        </div>
      }
      header="Send Contract"
      onSubmit={handleSubmit}
    />
  );
};

export default Step2;
