import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Page } from '../common';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newHires: [] };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    axios.get('/onboard/newhire')
      .then((res) => {
        const newHires = res.data;
        this.setState({ newHires });
      });
  }

  handleClick(event) {
    this.props.setParentState('newHireId', event.currentTarget.getAttribute('data-id'));
    this.props.history.replace(`/step/${event.currentTarget.getAttribute('data-step')}`);
  }

  render() {
    const newHireItems = this.state.newHires.map((newHire) => {
      const percent = (newHire.step / 7) * 100;
      const barStyle = { width: `${percent}%` };
      return (
        <li
          className="card-item"
          onClick={this.handleClick}
          key={newHire.id}
          data-step={newHire.step}
          data-id={newHire.id}
        >
          {`${newHire.firstName} ${newHire.lastName}`}
          <br />
          <div className="progress w-100">
            <div className="progress-bar bg-success" role="progressbar" style={barStyle} />
          </div>
        </li>
      );
    });
    return (
      <Page
        content={
          <ul id="inProgress" className="list-group list-group-flush">
            {newHireItems}
          </ul>
        }
        buttons={
          <Link className="btn btn-success" to="/step/1">New Talent</Link>
        }
        header="Onboarding in Progress"
      />
    );
  }
}

export default Home;
