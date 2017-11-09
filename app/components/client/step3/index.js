import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { actions as formActions } from 'react-redux-form';
import mutations from '../../../graphql/mutations';
import queries from '../../../graphql/queries';
import actions from '../../../redux/actions';
import selectors from '../../../redux/selectors';
import Step3 from './view';
import Step4 from '../step4';

const Container = (props) => {
  const { currentHire: { step } } = props;
  if (step) {
    if (step > 3) return <Step4 />;
    return <Step3 {...props} />;
  }
  return null;
};

const mapStateToProps = state => ({
  activeTab: selectors.selectActiveTab(state),
  spinner: selectors.selectSpinner(state),
  message: selectors.selectUploadMessage(state),
  src: selectors.selectUploadUrl(state),
  form: state.form.contractClient
});
const mapDataToProps = ({ ownProps: { form, dispatch, data, uploadSignature }, mutate: previewContract }) => {
  const currentHire = data.newHire || {};
  return {
    currentHire,
    handleSubmit: (formData) => {
      dispatch(actions.setSpinnerVisibility(true));
      return previewContract({ variables: { formData, id: currentHire.id } })
        .then(({ data: { previewContract: hire } }) => {
          dispatch(actions.updateCurrentHire(hire));
          dispatch(actions.setSpinnerVisibility(false));
          dispatch(actions.replace('/talent/preview'));
        });
    },
    handleUpload: ([file]) => {
      dispatch(actions.setUploadMessage(1));
      dispatch(actions.setSpinnerVisibility(true));
      return uploadSignature({ variables: { file, id: currentHire.id } })
        .then(() => {
          dispatch(actions.setUploadImageUrl(`/upload/${currentHire.id}.bmp?${Date.now()}`));
          dispatch(actions.setUploadMessage(2));
          dispatch(actions.setSpinnerVisibility(false));
        });
    },
    handleTabSelected: (index) => { dispatch(actions.setActiveTab(index)); },
    updateForm: () => {
      if (data.newHire && !form.firstName && !form.lastName && !form.email) {
        dispatch(actions.setCurrentHire(data.newHire));
        ['firstName', 'lastName', 'email'].forEach((field) => {
          dispatch(formActions.change(`form.contractClient.${field}`, data.newHire[field]));
          dispatch(formActions.setValidity(`form.contractClient.${field}`, true));
        });
      }
    }
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(queries.getNewHire, { options: { variables: { id: window.location.search.substring(4) } } }),
  graphql(mutations.uploadSignature, { props: ({ mutate }) => ({ uploadSignature: mutate }) }),
  graphql(mutations.previewContract, { props: mapDataToProps })
)(Container);
