import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import mutations from '../../../graphql/mutations';
import actions from '../../../redux/actions';
import selectors from '../../../redux/selectors';
import Step2 from './view';

const Step2Container = props => <Step2 {...props} />;
const mapStateToProps = state => ({ id: selectors.selectId(state) });
const mapDataToProps = ({ ownProps: { id, dispatch, skipStep }, mutate: sendContract }) => ({
  handleSubmit: formData => sendContract({ variables: { formData, id } })
    .then(() => { dispatch(actions.replace('/admin/3')); }),
  handleClickSkip: () => skipStep({ variables: { step: 5, id } })
    .then(() => { dispatch(actions.replace('/admin/5')); })
});

export default compose(
  connect(mapStateToProps),
  graphql(mutations.skipStep, { props: ({ mutate }) => ({ skipStep: mutate }) }),
  graphql(mutations.sendContract, { props: mapDataToProps })
)(Step2Container);
