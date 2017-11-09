import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import mutations from '../../../graphql/mutations';
import actions from '../../../redux/actions';
import Step1 from './view';

const Step1Container = props => <Step1 {...props} />;
const mapDataToProps = ({ ownProps: { dispatch }, mutate: addNewHire }) => ({
  handleSubmit: formData => addNewHire({ variables: { formData } })
      .then(({ data }) => {
        dispatch(actions.setCurrentHire(data.newHire));
        dispatch(actions.replace('/admin/2'));
      })
});
export default compose(connect(), graphql(mutations.addNewHire, { props: mapDataToProps }))(Step1Container);
