import React from 'react';
import { FullscreenPage } from '../../shared/index';

const Step4 = (props) => {
  const { handleClickReject, handleClickAccept } = props;
  return (
    <FullscreenPage
      buttons={
        <div>
          <button className="btn btn-danger" type="button" onClick={handleClickReject}>Reject</button>
          &nbsp;
          <button className="btn btn-success" type="button" onClick={handleClickAccept}>Sign</button>
        </div>
      }
    />
  );
};

export default Step4;
