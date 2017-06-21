import React from 'react';
import { connect } from 'react-redux';
import Step4 from './view';
import actions from '../../../redux/actions';

class Step4Container extends React.Component {
  componentDidMount() {
    this.props.dispatch(actions.embedPDFAdmin(this.props.id));
  }

  render() {
    return <Step4 {...this.props} />;
  }
}

const mapStateToProps = ({ currentHire: { id } }) => ({ id });
const mergeProps = (stateProps, { dispatch }, ownProps) => Object.assign({ dispatch }, stateProps, ownProps, {
  handleClickAccept: () => { dispatch(actions.acceptContract(stateProps.id)); },
  handleClickReject: () => { dispatch(actions.skipStep(2, stateProps.id)); }
});

export default connect(mapStateToProps, null, mergeProps)(Step4Container);
