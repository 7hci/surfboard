import React from 'react';

const Page = props => (
  <div className="page-wrapper">
    <div className="page-container">
      <div className="page-row">
        <form className="col-lg-6 col-md-8 col-sm-10 col-xs-12" onSubmit={props.onSubmit}>
          <div className="page-card">
            <div className="page-header">{props.header}</div>
            {props.content}
            {props.buttons ?
              <div className="d-flex justify-content-end card-block">
                {props.buttons}
              </div> : null}
          </div>
        </form>
      </div>
      {props.spinner ? <div className="spinner"><img src="/img/loading.gif" alt="Loading" /></div> : null}
    </div>
  </div>
);

export default Page;
