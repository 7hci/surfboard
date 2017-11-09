import React from 'react';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';

const transitionProps = {
  transitionName: 'slide',
  transitionAppear: true,
  transitionEnterTimeout: 400,
  transitionLeaveTimeout: 400,
  transitionAppearTimeout: 400
};
const match = (path, routes) => routes.find(route => route.path === path);
const Router = (props) => {
  const matched = match(props.router.location.pathname, props.routes);
  const handlerProps = Object.assign({}, props, { key: props.router.href });
  const component = matched ? <matched.handler {...handlerProps} /> : <div>404 Not Found</div>;
  return <CSSTransitionGroup {...transitionProps}>{ component }</CSSTransitionGroup>;
};

export default connect(({ router }) => ({ router }))(Router);
