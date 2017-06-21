import React from 'react';
import { connect } from 'react-redux';
import actions from '../../../redux/actions';

import Home from './view';

class HomeContainer extends React.Component {
  componentDidMount() {
    this.props.dispatch(actions.getNewHires());
  }

  render() {
    return <Home {...this.props} />;
  }
}

const mapStateToProps = ({ newHires }) => ({ newHires });
const mapDispatchToProps = dispatch => ({
  handleClick: ({ currentTarget }) => {
    const newHire = { id: currentTarget.getAttribute('data-id') };
    dispatch(actions.setCurrentHire(newHire));
    dispatch(actions.replace(`/admin/${currentTarget.getAttribute('data-step')}`));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
