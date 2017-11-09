import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import mutations from '../../../graphql/mutations';
import queries from '../../../graphql/queries';
import Step6 from './view';
import actions from '../../../redux/actions';
import selectors from '../../../redux/selectors';

const Step6Container = props => <Step6 {...props} />;
const mapStateToProps = state => ({ id: selectors.selectId(state) });
const mapDataToProps = ({ ownProps: { id, dispatch, skipStep }, mutate: completeHire }) => ({
  handleClickComplete: () => completeHire({ variables: { id }, refetchQueries: [{ query: queries.getNewHires }] })
    .then(() => { dispatch(actions.replace('/admin')); }),
  handleClickItem: (event) => {
    const step = event.currentTarget.getAttribute('data-step');
    return skipStep({ variables: { step, id } })
      .then(() => { dispatch(actions.replace(`/admin/${step}`)); });
  }
});

export default compose(
  connect(mapStateToProps),
  graphql(mutations.skipStep, { props: ({ mutate }) => ({ skipStep: mutate }) }),
  graphql(mutations.completeHire, { props: mapDataToProps })
)(Step6Container);
