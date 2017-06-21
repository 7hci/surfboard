import React from 'react';
import { connect } from 'react-redux';
import Step2 from './view';
import actions from '../../../redux/actions';

const Step2Container = props => <Step2 {...props} />;
const mapStateToProps = ({ currentHire: { id }, form: { contractAdmin } }) =>
  ({ id, form: contractAdmin });
const mergeProps = (stateProps, { dispatch }, ownProps) => Object.assign({ dispatch }, stateProps, ownProps, {
  handleClickSkip: () => { dispatch(actions.skipStep(5, stateProps.id)); },
  handleSubmit: () => { dispatch(actions.sendContract(stateProps.form, stateProps.id)); }
});

export default connect(mapStateToProps, null, mergeProps)(Step2Container);
