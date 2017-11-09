import React from 'react';
import { FullscreenPage, Link } from '../../shared/index';

const Step3Preview = (props) => {
  const { handleClickSign } = props;
  return (
    <FullscreenPage
      key="preview"
      buttons={
        <div>
          <Link className="btn btn-secondary" href="/talent" replace>Back</Link>
          &nbsp;
          <button className="btn btn-success" type="button" onClick={handleClickSign}>Sign</button>
        </div>
      }
    />
  );
};

export default Step3Preview;
