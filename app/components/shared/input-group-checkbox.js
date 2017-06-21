import React from 'react';
import { Control } from 'react-redux-form';

const InputGroupCheckbox = props => (
  <div className="input-group-check">
    <label htmlFor={props.model} className="form-check-label">
      <Control.checkbox
        type="checkbox"
        className="form-check-input"
        model={props.model}
        id={props.id || props.model}
        getValue={event => event.target.checked}
      /> {props.label}
    </label>
  </div>
);

export default InputGroupCheckbox;
