import React from 'react';
import axios from 'axios';
import { Page } from '../common';

class Step3 extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickSkip = this.handleClickSkip.bind(this);
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

  render() {
    return (
      <Page
        content={
          <div className="card-block">
            <p>
              An e-mail has been sent to the new hire with instructions on how to complete the
              and sign the contract. Onboarding will resume once this step is completed.
            </p>
          </div>
        }
        buttons={
          <div>
            <button className="btn btn-secondary" type="button" onClick={this.handleClickSkip}>
              Skip
            </button>
          </div>
        }
        header="Contract Sent"
      />
    );
  }
}

export default Step3;
