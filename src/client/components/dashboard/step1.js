import React from 'react';
import axios from 'axios';
import { Page, InputGroupText, InputGroupCheckbox } from '../common';

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
    this.state = { inputs: {} };
  }

  handleChange(event) {
    const input = event.target;
    const value = input.type === 'checkbox' ? input.checked : input.value;
    const inputs = Object.assign({}, this.state.inputs);
    inputs[input.name] = value;
    this.setState({ inputs });
  }

  handleClickCancel() {
    this.props.history.replace('/');
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/onboard/add', this.state.inputs)
      .then((res) => {
        if (res.data && res.data.error) {
          alert('Server error!');
        } else {
          this.props.setParentState('newHireId', res.data.newHire.id);
          this.props.history.replace('/step/2');
        }
      });
  }

  render() {
    return (
      <Page
        content={
          <div className="card-block">
            <InputGroupText id="firstName" label="First Name" onChange={this.handleChange} />
            <InputGroupText id="lastName" label="Last Name" onChange={this.handleChange} />
            <InputGroupText id="email" label="E-mail" type="email" onChange={this.handleChange} />
            <label className="input-group-label" htmlFor="override">
              <span>Override Generated Local-Part:</span>
            </label>
            <div className="input-group">
              <input className="form-control" type="text" name="override" id="override" onChange={this.handleChange} />
              <span className="input-group-addon">@7hci.com</span>
            </div>
            <InputGroupCheckbox id="resident" label="U.S. Resident" onChange={this.handleChange} />
          </div>
        }
        buttons={
          <div>
            <button className="btn btn-secondary" type="click" onClick={this.handleClickCancel}>Cancel</button>&nbsp;
            <input className="btn btn-success" type="submit" value="New Talent" />
          </div>
        }
        header="General Information"
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default Step1;
