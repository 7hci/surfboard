import React from 'react';
import Page from '../../shared/page';

const Step4 = () => (
  <Page
    content={
      <div className="card-block">
        <p>
          Your contract has been submitted. You will be notified by e-mail once it has
          been reviewed and countersigned.
        </p>
      </div>
    }
    header="Contract Submitted"
  />
);

export default Step4;
