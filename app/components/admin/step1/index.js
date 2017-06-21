import React from 'react';
import { connect } from 'react-redux';
import Step1 from './view';
import actions from '../../../redux/actions';

const Step1Container = props => <Step1 {...props} />;
const mapStateToProps = ({ form: { info } }) => ({ form: info });
const mergeProps = (stateProps, { dispatch }, ownProps) => Object.assign({ dispatch }, stateProps, ownProps, {
  handleSubmit: () => { dispatch(actions.addNewHire(stateProps.form)); }
});

export default connect(mapStateToProps, null, mergeProps)(Step1Container);
