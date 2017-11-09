import React from 'react';
import { connect } from 'react-redux';
import { navigate, replace } from 'redux-routing';

const Link = (props) => {
  const onNavigate = (event) => {
    event.preventDefault();
    props.replace ? props.dispatch(replace(event.target.href)) : props.dispatch(navigate(event.target.href));
  };
  const linkProps = Object.assign({}, props, { onClick: onNavigate });
  delete linkProps.dispatch;
  delete linkProps.replace;
  return <a {...linkProps} >{props.children}</a>;
};

export default connect()(Link);
