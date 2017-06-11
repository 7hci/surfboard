import React from 'react';

const InputGroupText = props => (
  <div className="form-group">
    <label
      htmlFor={props.id}
      className="input-group-label"
    >
      <span>{props.label}</span>
      {props.secondLabel ? <br /> : '' }
      <span><em>{props.secondLabel}</em></span>
      <input
        type={props.type}
        name={props.id}
        id={props.id}
        className="form-control"
        value={props.value}
        required={props.required}
        onChange={props.onChange}
      />
    </label>
  </div>
);

InputGroupText.defaultProps = {
  type: 'text',
  required: true
};

export default InputGroupText;
