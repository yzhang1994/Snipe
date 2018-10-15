import React, { Component } from 'react';
import Redirect from 'react-router/Redirect';
import { HashRouter, Switch, Route } from 'react-router-dom';

// import web3Helper from './utils/web3';
// import { getFiles } from './utils/contract';
import ERC20Port from './components/ERC20/ERC20Port';

class App extends Component {
  render() {
    return (
      <div>
        <HashRouter basename="/">
          <Switch>
            <Route exact path="/" render={() => (<Redirect to="/erc20" />)} />
            <Route
              path="/erc20"
              render={() => (
                <ERC20Port
                  {...this.state}
                />
              )}
            />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default App;
