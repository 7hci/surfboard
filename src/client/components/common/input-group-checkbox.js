import React from 'react';

const InputGroupCheckbox = props => (
  <div className="input-group-check">
    <label htmlFor={props.id} className="form-check-label">
      <input
        type="checkbox"
        className="form-check-input"
        id={props.id}
        name={props.id}
        onChange={props.onChange}
      /> {props.label}
    </label>
  </div>
);

export default InputGroupCheckbox;
