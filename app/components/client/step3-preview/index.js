import React from 'react';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import Step3Preview from './view';

class Container extends React.Component {
  componentDidMount() {
    this.props.dispatch(actions.embedPDFClient(this.props.currentHire));
  }

  render() {
    return <Step3Preview {...this.props} />;
  }
}

const mapStateToProps = ({ currentHire }) => ({ currentHire });
const mergeProps = (stateProps, { dispatch }, ownProps) => Object.assign({ dispatch }, stateProps, ownProps, {
  handleClickSign: () => { dispatch(actions.signContract(stateProps.currentHire.id)); }
});

export default connect(mapStateToProps, null, mergeProps)(Container);
