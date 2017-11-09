import React from 'react';
import Signature from 'react-another-signature-pad';
import { FullscreenPage } from '../../shared/index';

const Step3Signature = (props) => {
  const { clear, handleDrawn, handleClickClear, handleClickUpload } = props;
  return (
    <FullscreenPage
      content={
        <Signature clear={clear} onEnd={handleDrawn} blob trim />
        }
      buttons={
        <div>
          <button className="btn btn-secondary" type="button" onClick={handleClickClear}>
              Clear
            </button>
            &nbsp;
          <button className="btn btn-success" type="button" onClick={handleClickUpload}>
              Upload
            </button>
        </div>
        }
    />
  );
};

export default Step3Signature;
