import React, { Component } from 'react';
import Redirect from 'react-router/Redirect';
import { HashRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import {
  getEvents, tokenBalanceOfPromise, tokenConstantPromise, convertBigNum,
} from './utils/erc20';
import ERC20Port from './components/ERC20/ERC20Port';
import Mapping from './components/Mapping/Mapping';
import Migration from './components/Migration/Migration';
import DeployToken from './components/Deploy/DeployToken';

const INITIAL = 3978343;
const FINAL = 4100000;
const SEGMENT = 10000;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      balances: {},
      newContractAddress: '',
      hashgraphAddresses: {},
      name: null,
      symbol: null,
      decimals: null,
      totalSupply: null,
      buttonLoading: false,
      hideButton: true,
    };
    this.submitContract = this.submitContract.bind(this);
    this.playback = this.playback.bind(this);
    this.getTokenConstants = this.getTokenConstants.bind(this);
    this.sendContract = this.sendContract.bind(this);
    this.setParentState = this.setParentState.bind(this);
  }

  setParentState(newState) { this.setState(newState); }

  async getTokenConstants() {
    try {
      const { address } = this.state;
      const name = await tokenConstantPromise(address, 'name');
      const symbol = await tokenConstantPromise(address, 'symbol');
      const decimals = await tokenConstantPromise(address, 'decimals');
      const totalSupply = await tokenConstantPromise(address, 'totalSupply');
      this.setState({ name, symbol, decimals, totalSupply });
    } catch (e) { console.error(e); }
  }

  async sendContract() {
    this.setState({ sendButtonLoading: true });
    const { address, balances, name, symbol, decimals, totalSupply } = this.state;
    const data = { address, name, symbol, decimals, totalSupply };
    try {
      const createTokenResponse = await axios.post('/target/create-token', data);
      console.log(createTokenResponse.data);
      const setBalanceResponse = await axios.post('/target/set-balance', { address, balances });
      console.log(setBalanceResponse.data);
    } catch (e) { console.error(e); }
    this.setState({ sendButtonLoading: false });
  }

  async submitContract(initial = INITIAL) {
    try {
      this.getTokenConstants();
      let initialBlock = initial;
      while (initialBlock + SEGMENT < FINAL) {
        await this.playback(initialBlock, initialBlock + SEGMENT);
        initialBlock += SEGMENT;
      }
      await this.playback(initialBlock, FINAL);
      this.setState({ hideButton: false });
    } catch (e) { console.error(e); }
  }

  async playback(initial, final) {
    const { address, balances } = this.state;
    this.setState({ buttonLoading: true });
    const transfers = await getEvents(address, initial, final);

    const holdersMap = {};
    transfers.forEach((transfer) => {
      const { to } = transfer.returnValues;
      holdersMap[to] = true;
    });
    // const balanceMap = {};
    const promises = Object.keys(holdersMap).map((holder) => {
      return tokenBalanceOfPromise(address, holder);
    });
    const balArray = await Promise.all(promises);

    const newMap = [];
    balArray.forEach((bal, i) => {
      if (bal > 0) {
        const holder = Object.keys(holdersMap)[i];
        newMap[holder] = convertBigNum(bal);
      }
    });
    const result = { ...balances, ...newMap };
    this.setState({ balances: result, buttonLoading: false });
    return result;
  }

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
                  setParentState={this.setParentState}
                  playback={this.playback}
                  submitContract={this.submitContract}
                  getTokenConstants={this.getTokenConstants}
                />
              )}
            />
            <Route
              path="/deploy"
              render={() => (
                <DeployToken
                  {...this.state}
                  setParentState={this.setParentState}
                />
              )}
            />
            <Route
              path="/mapping"
              render={() => (
                <Mapping
                  {...this.state}
                  setParentState={this.setParentState}
                />
              )}
            />
            <Route
              path="/migration"
              render={() => (
                <Migration
                  {...this.state}
                  setParentState={this.setParentState}
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
