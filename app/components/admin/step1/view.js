import React from 'react';
import { Control } from 'react-redux-form';
import { Page, InputGroupText, InputGroupCheckbox, Link } from '../../shared/index';

const Step1 = (props) => {
  const { handleSubmit } = props;
  return (
    <Page
      model="form.info"
      content={
        <div className="card-block">
          <InputGroupText model="form.info.firstName" label="First Name" />
          <InputGroupText model="form.info.lastName" label="Last Name" />
          <InputGroupText model="form.info.email" label="E-mail" type="email" />
          <label className="input-group-label" htmlFor="form.info.override">
            <span>Override Generated Local-Part:</span>
          </label>
          <div className="input-group">
            <Control.text className="form-control" model="form.info.override" id="form.info.override" />
            <span className="input-group-addon">@7hci.com</span>
          </div>
          <InputGroupCheckbox model="form.info.resident" label="U.S. Resident" />
        </div>
      }
      buttons={
        <div>
          <Link className="btn btn-secondary" href="/admin" replace>Cancel</Link>&nbsp;
          <input className="btn btn-success" type="submit" value="New Talent" />
        </div>
      }
      header="General Information"
      onSubmit={handleSubmit}
    />
  );
};

export default Step1;
