import React, { Component } from 'react';
import axios from 'axios';
import { Input, Button, Label } from 'bloomer';
import {
  getEvents, tokenBalanceOfPromise, tokenConstantPromise, convertBigNum,
} from '../../utils/erc20';

const INITIAL = 3978343;
const FINAL = 4100000;
const SEGMENT = 10000;

class ERC20Port extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      balances: {},
      buttonLoading: false,
      name: null,
      symbol: null,
      decimals: null,
      totalSupply: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitContract = this.submitContract.bind(this);
    this.playback = this.playback.bind(this);
    this.getTokenConstants = this.getTokenConstants.bind(this);
    this.sendContract = this.sendContract.bind(this);
  }

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
    const { address, balances, name, symbol, decimals, totalSupply } = this.state;
    const data = { address, balances, name, symbol, decimals, totalSupply };
    try {
      const response = axios.post('/target/create-token', data);
      console.log(response.data);
    } catch (e) { console.error(e); }
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

  handleChange(e) {
    this.setState({ address: e.target.value });
  }

  render() {
    const { address, balances, buttonLoading, name, symbol, decimals, totalSupply } = this.state;
    return (
      <div>
        <div className="hero is-light is-small">
          <div className="hero-body container has-text-centered">
            <img src="/images/logo.png" width="200px" alt="logo" />
            <br />
            <h1 className="title is-1">
              snipe
            </h1>
            <h3 className="is-size-5">
              A Data Port between Ethereum and Hashgraph
            </h3>
          </div>
        </div>
        <div className="container section has-text-centered">
          <Label className="is-size-5">Enter your ERC20 Token Address</Label>
          <br />
          <Input name="address" onChange={this.handleChange} value={address} />
          <br />
          <br />
          <Button
            isColor="dark"
            isLoading={buttonLoading}
            isSize="large"
            onClick={() => { this.submitContract(); }}
          >
            Submit
          </Button>
          <br />
          <br />
          <div className="columns">
            <div className="column has-text-left is-4 has-text-weight-bold">
              <br />
              {name && (<div>Name: {name}</div>)}
              {symbol && (<div>Symbol: {symbol}</div>)}
              {decimals && (<div>Decimals: {decimals}</div>)}
              {totalSupply && (<div>Total Supply: {totalSupply}</div>)}
            </div>
            <div className="column">
              <code className="has-text-left">
                {Object.keys(balances).map((holder) => {
                  return (
                    <div key={holder}>{holder} : {balances[holder]}</div>
                  );
                })}
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default ERC20Port;
