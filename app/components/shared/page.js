import React from 'react';
import { Form } from 'react-redux-form';

export default (props) => {
  const { model = 'form.none', onSubmit, header, content, buttons, spinner } = props;
  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="page-row">
          <Form className="col-lg-6 col-md-8 col-sm-10 col-xs-12" model={model} onSubmit={onSubmit}>
            <div className="page-card">
              <div className="page-header">{header}</div>
              {content}
              {buttons ?
                <div className="d-flex justify-content-end card-block">
                  {buttons}
                </div> : null}
            </div>
          </Form>
        </div>
        {spinner ? <div className="spinner"><img src="/img/loading.gif" alt="Loading" /></div> : null}
      </div>
    </div>
  );
};
