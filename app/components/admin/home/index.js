import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import queries from '../../../graphql/queries';
import actions from '../../../redux/actions';
import Home from './view';

const HomeContainer = props => <Home {...props} />;
const mapDataToProps = ({ data: { newHires = [] }, ownProps: { dispatch } }) => ({
  newHires,
  handleClick: ({ currentTarget }) => {
    const newHire = { id: currentTarget.getAttribute('data-id') };
    dispatch(actions.setCurrentHire(newHire));
    dispatch(actions.replace(`/admin/${currentTarget.getAttribute('data-step')}`));
  }
});
export default compose(connect(), graphql(queries.getNewHires, { props: mapDataToProps }))(HomeContainer);
