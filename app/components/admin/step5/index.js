import React from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import mutations from '../../../graphql/mutations';
import actions from '../../../redux/actions';
import selectors from '../../../redux/selectors';
import { status } from '../../../constants';
import Before from './before';
import After from './after';

let socket;

class Step5Container extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(actions.resetTasks());
    dispatch(actions.setProgress(status.NOT_STARTED));
    socket = io();
    socket.on('finish', () => {
      dispatch(actions.setSpinnerVisibility(false));
      dispatch(actions.setProgress(status.DONE));
    });
    socket.on('server_error', () => {
      console.log('Server error');
      dispatch(actions.setSpinnerVisibility(false));
    });
    socket.on('update', (update) => {
      dispatch(actions.updateTask(update));
    });
  }

  componentWillUnmount() {
    socket.close();
  }

  render() {
    return this.props.progress === status.NOT_STARTED ? <Before {...this.props} /> : <After {...this.props} />;
  }
}
const mapStateToProps = state => ({
  id: selectors.selectId(state),
  tasks: selectors.selectTasks(state),
  spinner: selectors.selectSpinner(state),
  progress: selectors.selectProgress(state),
  form: state.form.onboarding
});
const mapDataToProps = ({ ownProps: { id, form, dispatch }, mutate: skipStep }) => ({
  handleClickReject: () => skipStep({ variables: { step: 6, id } })
    .then(() => { dispatch(actions.replace('/admin/6')); }),
  handleClickStart: () => {
    dispatch(actions.setSpinnerVisibility(true));
    dispatch(actions.setProgress(status.STARTED));
    socket.emit('onboard', form, id);
  },
  handleClickSkip: () => skipStep({ variables: { step: 6, id } })
    .then(() => { dispatch(actions.replace('/admin/6')); })
});
export default compose(
  connect(mapStateToProps),
  graphql(mutations.skipStep, { props: mapDataToProps })
)(Step5Container);
