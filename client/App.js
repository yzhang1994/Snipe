import React, { Component } from 'react';
import Redirect from 'react-router/Redirect';
import { HashRouter, Switch, Route } from 'react-router-dom';

import ERC20Port from './components/ERC20/ERC20Port';
import Mapping from './components/Mapping/Mapping';
import Migration from './components/Migration/Migration';


class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <HashRouter basename="/">
          <Switch>
            <Route exact path="/" render={() => (<Redirect to="/erc20" />)} />
            <Route
              path="/erc20"
              render={() => (
                <ERC20Port />
              )}
            />
            <Route
              path="/my"
              render={() => (
                <Mapping />
              )}
            />
            <Route
              path="/world"
              render={() => (
                <Migration />
              )}
            />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default App;
