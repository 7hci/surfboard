import React from 'react';

const FullscreenPage = props => (
  <div>
    <div className="fullscreen-content" id="content">{props.content}</div>
    <div className="fullscreen-footer">{props.buttons}</div>
  </div>
);

export default FullscreenPage;
