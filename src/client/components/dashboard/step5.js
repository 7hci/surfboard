import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Page } from '../common';

class Step5 extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = { inputs: {}, tasks: [], start: false, done: false, updates: [] };
  }

  componentDidMount() {
    axios.get('/onboard/tasks')
      .then((res) => {
        const tasks = res.data;
        this.setState({ tasks });
      });
    this.socket = io();
    this.socket.on('finish', () => {
      this.setState({ done: true, spinnerVisible: false });
    });
    this.socket.on('server_error', () => {
      alert('Server error');
      this.setState({ spinnerVisible: false });
    });
    this.socket.on('update', (msg) => {
      const newUpdates = Array.from(this.state.updates);
      newUpdates.push(msg);
      this.setState({ updates: newUpdates });
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleInputChange(event) {
    const input = event.target;
    const value = input.type === 'checkbox' ? input.checked : input.value;
    const inputs = Object.assign({}, this.state.inputs);
    inputs[input.name] = value;
    this.setState({ inputs });
  }

  handleClick(event) {
    if (event.currentTarget.getAttribute('data-click') === 'skip') {
      axios.post(`/onboard/skip?to=6&id=${this.props.newHireId}`)
        .then((res) => {
          if (res.data && res.data.error) {
            alert('Server error!');
          } else {
            this.props.history.replace('/step/6');
          }
        });
    } else {
      this.setState({ start: true, spinnerVisible: true });
      this.socket.emit('onboard', this.state.inputs, this.props.newHireId);
    }
  }

  render() {
    const contentBeforeStart = (
      <div className="card-block">
        {this.state.tasks.map(task => (
          <div className="input-group-check" key={task.name}>
            <label className="form-check-label" htmlFor={task.name}>
              <input
                className="form-check-input"
                id={task.name}
                name={task.name}
                type="checkbox"
                onChange={this.handleInputChange}
              />
              {task.text}
            </label>
          </div>
        ))}
      </div>
    );
    const contentAfterStart = (
      <div className="card-block">
        {this.state.tasks.reduce((accumulator, task) => {
          if (this.state.inputs[task.name]) {
            const update = this.state.updates.find(u => u.task === task.name);
            let status;
            let icon = '';
            let message;
            if (update) {
              status = update.status;
              icon = `fa fa-inverse fa-stack-1x ${(status === 'success') ? 'fa-check' : 'fa-times'}`;
              message = update.text;
            } else {
              status = 'loading';
              message = task.text;
            }
            accumulator.push(
              <p className={status} key={task.name}>
                <span className="fa-stack">
                  <i className="fa fa-square fa-stack-2x" /><i className={icon} />
                </span>&nbsp;{message}
              </p>
            );
          }
          return accumulator;
        }, [])}
      </div>
    );
    const buttonsBeforeStart = (
      <div>
        <button className="btn btn-secondary" type="button" data-click="skip" onClick={this.handleClick}>
          Skip
        </button>&nbsp;
        <button className="btn btn-success" type="button" data-click="start" onClick={this.handleClick}>
          Start
        </button>
      </div>
    );
    const buttonsAfterStart = (
      <div>
        <Link className="btn btn-success" to="/step/6">
          Continue
        </Link>
      </div>
    );
    let buttons = null;
    let content = null;
    if (!this.state.start) {
      buttons = buttonsBeforeStart;
      content = contentBeforeStart;
    } else {
      content = contentAfterStart;
      if (this.state.done) {
        buttons = buttonsAfterStart;
      }
    }

    return (
      <Page
        content={content}
        buttons={buttons}
        header="Onboarding Tasks"
        spinner={this.state.spinnerVisible}
      />
    );
  }
}

export default Step5;
