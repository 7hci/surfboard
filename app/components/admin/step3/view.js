import React from 'react';
import { Page } from '../../shared/index';

const Step3 = (props) => {
  const { handleClickSkip } = props;
  return (
    <Page
      content={
        <div className="card-block">
          <p>
            An e-mail has been sent to the new hire with instructions on how to complete the
            and sign the contract. Onboarding will resume once this step is completed.
          </p>
        </div>
      }
      buttons={<button className="btn btn-secondary" type="button" onClick={handleClickSkip}>Skip</button>}
      header="Contract Sent"
    />
  );
};

export default Step3;
