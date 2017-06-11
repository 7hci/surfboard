import React from 'react';
import axios from 'axios';
import { Page, InputGroupText } from '../common';

const message = 'Please click the link below to complete and sign the Master Subcontractor Service '
              + 'Agreement. If you have any questions or concerns, please let me know.';

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickSkip = this.handleClickSkip.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { inputs: { message } };
  }

  handleChange(event) {
    const input = event.target;
    const inputs = Object.assign({}, this.state.inputs);
    inputs[input.name] = input.value;
    this.setState({ inputs });
  }

  handleClickSkip() {
    axios.post(`/onboard/skip?to=5&id=${this.props.newHireId}`)
      .then((res) => {
        if (res.data && res.data.error) {
          alert('Server error!');
        } else {
          this.props.history.replace('/step/5');
        }
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post(`/onboard/contract/send?id=${this.props.newHireId}`, this.state.inputs)
      .then((res) => {
        if (res.data && res.data.error) {
          alert('Server error!');
        } else {
          this.props.history.replace('/step/3');
        }
      });
  }

  render() {
    return (
      <Page
        content={
          <div className="card-block">
            <div className="form-group">
              <label className="input-group-label" htmlFor="message">
                <span>Custom Message</span>
                <textarea
                  className="form-control"
                  name="message"
                  id="message"
                  rows="7"
                  required
                  value={this.state.inputs.message}
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <InputGroupText id="cc" label="CC (Optional)" type="email" required={false} onChange={this.handleChange} />
          </div>
        }
        buttons={
          <div>
            <button className="btn btn-secondary" type="button" onClick={this.handleClickSkip}>Skip</button>&nbsp;
            <input className="btn btn-success" type="submit" value="Send" />
          </div>
        }
        header="Send Contract"
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default Step2;
