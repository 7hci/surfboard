import React from 'react';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';
import Step3 from './view';
import Step4 from '../step4';

class Container extends React.Component {
  componentDidMount() {
    if (!this.props.currentHire.id) {
      const id = window.location.search.substring(4);
      this.props.dispatch(actions.getNewHire(id));
    }
  }

  render() {
    const { currentHire: { step } } = this.props;
    if (step) {
      if (step > 3) return <Step4 />;
      return <Step3 {...this.props} />;
    }
    return null;
  }
}

const mapStateToProps = ({ currentHire, activeTab, spinner, upload, form: { contractClient: form } }) =>
  ({ currentHire, activeTab, spinner, message: upload.message, src: upload.src, form });
const mergeProps = (stateProps, { dispatch }, ownProps) => Object.assign({ dispatch }, stateProps, ownProps, {
  handleUpload: (files) => { dispatch(actions.uploadFileSignature(files[0], stateProps.currentHire.id)); },
  handleSubmit: (form) => { dispatch(actions.previewContract(form, stateProps.currentHire)); },
  handleTabSelected: (index) => { dispatch(actions.setActiveTab(index)); }
});

export default connect(mapStateToProps, null, mergeProps)(Container);
