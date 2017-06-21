import React from 'react';
import { connect } from 'react-redux';
import Step3 from './view';
import actions from '../../../redux/actions';

const Step3Container = props => <Step3 {...props} />;
const mapStateToProps = ({ currentHire: { id } }) => ({ id });
const mergeProps = (stateProps, { dispatch }, ownProps) => Object.assign({ dispatch }, stateProps, ownProps, {
  handleClickSkip: () => { dispatch(actions.skipStep(5, stateProps.id)); }
});

export default connect(mapStateToProps, null, mergeProps)(Step3Container);
