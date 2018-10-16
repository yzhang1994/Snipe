import React, { Component } from 'react';
import { Button } from 'bloomer';
import axios from 'axios';
import { convertBigNum } from '../../utils/erc20';
import Hero from '../Hero';

class Migration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoading: false,
      newBalances: [],
    };
    this.setBalance = this.setBalance.bind(this);
    this.getBalance = this.getBalance.bind(this);
  }

  async setBalance() {
    this.setState({ buttonLoading: true });
    const { balances, newContractAddress } = this.props;

    let setBalanceResponse;
    try {
      setBalanceResponse = await axios.post('/target/set-all-balances', {
        balances,
        address: newContractAddress,
      }, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
      console.log(setBalanceResponse.data);
    } catch (e) { console.error(e); }

    this.setState({ buttonLoading: false });

    let index = 0;
    while (index < Object.keys(balances).length) {
      const holder = balances[index];
      await this.getBalance(holder);
      index += 1;
    }
  }

  async getBalance(holder) {
    const { newBalances } = this.state;
    const { newContractAddress } = this.props;
    const getBalanceResponse = await axios.post('/target/set-balance', {
      holder,
      contractAddress: newContractAddress,
    });
    console.log(getBalanceResponse.data);
    const value = getBalanceResponse.data;
    this.setState({ newBalances: { ...newBalances, [holder]: convertBigNum(value) } });
  }

  render() {
    const { buttonLoading, newBalances } = this.state;

    return (
      <div>
        <Hero />
        <div className="container has-text-centered">
          <br />
          <Button
            disabled
            isColor="dark"
            isSize="large"
          >
            Write to Hashgraph
          </Button>
          &nbsp;
          <Button
            isColor="dark"
            isLoading={buttonLoading}
            isSize="large"
            onClick={this.setBalance}
          >
            Write to TestRPC
          </Button>
          <br />
          <br />
          <code className="has-text-centered">
            {Object.keys(newBalances).map((holder) => {
              return (
                <div key={holder}>{holder} : {newBalances[holder]}</div>
              );
            })}
          </code>
        </div>
      </div>
    );
  }
}

export default Migration;
