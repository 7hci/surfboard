import React from 'react';
import { connect } from 'react-redux';
import Step6 from './view';
import actions from '../../../redux/actions';

const Step6Container = props => <Step6 {...props} />;
const mapStateToProps = ({ currentHire: { id } }) => ({ id });
const mergeProps = (stateProps, { dispatch }, ownProps) => Object.assign({ dispatch }, stateProps, ownProps, {
  handleClickComplete: () => {
    dispatch(actions.completeHire(stateProps.id));
  },
  handleClickItem: (event) => {
    dispatch(actions.skipStep(event.currentTarget.getAttribute('data-step'), stateProps.id));
  }
});

export default connect(mapStateToProps, null, mergeProps)(Step6Container);
