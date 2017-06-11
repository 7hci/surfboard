import React from 'react';
import axios from 'axios';
import { Page } from '../common';

class Step6 extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickItem = this.handleClickItem.bind(this);
    this.handleClickComplete = this.handleClickComplete.bind(this);
  }

  handleClickComplete() {
    axios.post(`/onboard/complete?id=${this.props.newHireId}`)
      .then((res) => {
        if (res.data && res.data.error) {
          alert('Server error!');
        } else {
          this.props.history.replace('/');
        }
      });
  }

  handleClickItem(event) {
    const step = event.currentTarget.getAttribute('data-step');
    axios.post(`/onboard/skip?to=${step}&id=${this.props.newHireId}`)
      .then((res) => {
        if (res.data && res.data.error) {
          alert('Server error!');
        } else {
          this.props.history.replace(`/step/${step}`);
        }
      });
  }

  render() {
    return (
      <Page
        content={
          <ul className="list-group list-group-flush">
            <li className="card-item" data-step="2" onClick={this.handleClickItem}>
              Send Contract
            </li>
            <li className="card-item" data-step="4" onClick={this.handleClickItem}>
              Review Contract
            </li>
            <li className="card-item" data-step="5" onClick={this.handleClickItem}>
              Onboarding Tasks
            </li>
          </ul>
        }
        buttons={
          <button className="btn btn-success" type="button" onClick={this.handleClickComplete}>
            Complete
          </button>
        }
        header="Revisit Previous Steps"
      />
    );
  }
}

export default Step6;
