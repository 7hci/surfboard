import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import { Dashboard, Dashboard1, Dashboard2, Dashboard3, Dashboard4, Dashboard5, Dashboard6 } from './dashboard';
import { Talent3, Talent4 } from './talent';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newHireId: '' };
    this.setParentState = this.setParentState.bind(this);
  }

  setParentState(key, value) {
    this.setState({ [key]: value });
  }

  render() {
    const all = {
      newHireId: this.state.newHireId,
      setParentState: this.setParentState
    };
    const transitionProps = {
      transitionName: 'slide',
      transitionAppear: true,
      transitionEnterTimeout: 400,
      transitionLeaveTimeout: 400,
      transitionAppearTimeout: 400
    };
    return (
      <Route render={({ location }) => (
        <CSSTransitionGroup {...transitionProps}>
          <Switch key={location.key} location={location}>
            <Route exact path="/" render={props => <Dashboard {...all} history={props.history} />} />
            <Route path="/step/1" render={props => <Dashboard1 {...all} history={props.history} />} />
            <Route path="/step/2" render={props => <Dashboard2 {...all} history={props.history} />} />
            <Route path="/step/3" render={props => <Dashboard3 {...all} history={props.history} />} />
            <Route path="/step/4" render={props => <Dashboard4 {...all} history={props.history} />} />
            <Route path="/step/5" render={props => <Dashboard5 {...all} history={props.history} />} />
            <Route path="/step/6" render={props => <Dashboard6 {...all} history={props.history} />} />
            <Route path="/talent/4" render={props => <Talent4 {...all} history={props.history} />} />
            <Route path="/talent" render={props => <Talent3 {...all} history={props.history} />} />
          </Switch>
        </CSSTransitionGroup>
      )}
      />
    );
  }
}

export default App;
