import React from 'react';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import Step3Signature from './view';

const Container = props => <Step3Signature {...props} />;
const mapStateToProps = ({ signature: { clear, data }, currentHire: { id } }) => ({ clear, data, id });
const mergeProps = (stateProps, { dispatch }, ownProps) => Object.assign({ dispatch }, stateProps, ownProps, {
  handleDrawn: (data) => { dispatch(actions.setSignatureData(data)); },
  handleClickClear: () => { dispatch(actions.clearSignature()); },
  handleClickUpload: () => { dispatch(actions.uploadDrawnSignature(stateProps.data, stateProps.id)); }
});

export default connect(mapStateToProps, null, mergeProps)(Container);
