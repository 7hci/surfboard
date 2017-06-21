import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import Before from './before';
import After from './after';
import actions from '../../../redux/actions';
import { status } from '../../../constants';

let socket;

class Step5Container extends React.Component {
  componentDidMount() {
    this.props.dispatch(actions.getTasks());
    this.props.dispatch(actions.setOnboardingProgress(status.NOT_STARTED));
    socket = io();
    socket.on('finish', () => {
      this.props.dispatch(actions.setSpinnerVisibility(false));
      this.props.dispatch(actions.setOnboardingProgress(status.DONE));
    });
    socket.on('server_error', () => {
      console.log('Server error');
      this.props.dispatch(actions.setSpinnerVisibility(false));
    });
    socket.on('update', (update) => {
      this.props.dispatch(actions.updateTask(update));
    });
  }

  componentWillUnmount() {
    socket.close();
  }

  render() {
    return this.props.progress === status.NOT_STARTED ? <Before {...this.props} /> : <After {...this.props} />;
  }
}

const mapStateToProps =
  ({ currentHire: { id }, tasks, spinner, onboardingProgress, form: { onboarding } }) =>
    ({ id, tasks, spinner, progress: onboardingProgress, form: onboarding });
const mergeProps = (stateProps, { dispatch }, ownProps) => Object.assign({ dispatch }, stateProps, ownProps, {
  handleClickSkip: () => {
    dispatch(actions.skipStep(6, stateProps.id));
  },
  handleClickStart: () => {
    dispatch(actions.setSpinnerVisibility(true));
    dispatch(actions.setOnboardingProgress(status.STARTED));
    dispatch(actions.startOnboarding(socket, stateProps.form, stateProps.id));
  }
});

export default connect(mapStateToProps, null, mergeProps)(Step5Container);
