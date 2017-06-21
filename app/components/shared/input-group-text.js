import React from 'react';
import { Control } from 'react-redux-form';

const InputGroupText = props => (
  <div className="form-group">
    <label htmlFor={props.model} className="input-group-label" >
      <span>{props.label}</span>
      {props.secondLabel ? <br /> : '' }
      <span><em>{props.secondLabel}</em></span>
      <Control.text
        type={props.type}
        className="form-control"
        model={props.model}
        id={props.model}
        required={props.required}
      />
    </label>
  </div>
);

InputGroupText.defaultProps = {
  type: 'text',
  required: true
};

export default InputGroupText;
