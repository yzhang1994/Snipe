import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Input, Button, Label } from 'bloomer';
import Hero from '../Hero';


class ERC20Port extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { setParentState } = this.props;
    setParentState({ address: e.target.value });
  }

  render() {
    const {
      address,
      balances,
      buttonLoading,
      name,
      symbol,
      decimals,
      totalSupply,
      hideButton,
      submitContract,
    } = this.props;

    return (
      <div>
        <Hero />
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
            onClick={() => { submitContract(); }}
          >
            Get Snapshot
          </Button>
          &nbsp;
          <NavLink to="/mapping">
            <Button
              isHidden={hideButton}
              isColor="info"
              isSize="large"
            >
              Continue
            </Button>
          </NavLink>
          <br />
          <br />
          <div className="columns">
            <div className="column has-text-left is-5 has-text-weight-bold">
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
