import React from 'react';
import { Page } from '../../shared/index';

const Step6 = (props) => {
  const { handleClickComplete, handleClickItem } = props;

  return (
    <Page
      content={
        <ul className="list-group list-group-flush">
          <li className="card-item" data-step="2" onClick={handleClickItem}>Send Contract</li>
          <li className="card-item" data-step="4" onClick={handleClickItem}>Review Contract</li>
          <li className="card-item" data-step="5" onClick={handleClickItem}>Onboarding Tasks</li>
        </ul>
      }
      buttons={<button className="btn btn-success" type="button" onClick={handleClickComplete}>Complete</button>}
      header="Revisit Previous Steps"
    />
  );
};

export default Step6;
