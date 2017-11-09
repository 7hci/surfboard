import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import mutations from '../../../graphql/mutations';
import actions from '../../../redux/actions';
import selectors from '../../../redux/selectors';
import Step3 from './view';

const Step3Container = props => <Step3 {...props} />;
const mapStateToProps = state => ({ id: selectors.selectId(state) });
const mapDataToProps = ({ ownProps: { dispatch, id }, mutate: skipStep }) => ({
  handleClickSkip: () => skipStep({ variables: { step: 5, id } })
    .then(() => { dispatch(actions.replace('/admin/5')); })
});
export default compose(
  connect(mapStateToProps),
  graphql(mutations.skipStep, { props: mapDataToProps })
)(Step3Container);
