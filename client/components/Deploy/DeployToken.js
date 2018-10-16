import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Button } from 'bloomer';
import Hero from '../Hero';


class DeployToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoading: false,
      nextButtonHidden: true,
    };
    this.deployContract = this.deployContract.bind(this);
  }

  async deployContract() {
    this.setState({ buttonLoading: true });
    const { address, name, symbol, decimals, totalSupply, setParentState } = this.props;
    const data = { address, name, symbol, decimals, totalSupply };
    try {
      const createTokenResponse = await axios.post('/target/create-token', data);
      if (createTokenResponse.data) {
        setParentState({ newContractAddress: createTokenResponse.data.address });
      }
    } catch (e) { console.error(e); }
    this.setState({ buttonLoading: false, nextButtonHidden: false });
  }

  render() {
    const {
      name,
      symbol,
      decimals,
      totalSupply,
      newContractAddress,
    } = this.props;
    const {
      buttonLoading,
      nextButtonHidden,
    } = this.state;

    return (
      <div>
        <Hero />
        <div className="container has-text-centered ">
          <div className="is-size-5 has-text-weight-bold">
            <br />
            {name && (<div>Name: {name}</div>)}
            {symbol && (<div>Symbol: {symbol}</div>)}
            {decimals && (<div>Decimals: {decimals}</div>)}
            {totalSupply && (<div>Total Supply: {totalSupply}</div>)}
          </div>
          <br />
          <Button
            isColor="dark"
            isLoading={buttonLoading}
            isSize="large"
            onClick={() => { this.deployContract(); }}
          >
            Deploy Token
          </Button>
          &nbsp;
          <NavLink to="/mapping">
            <Button
              isHidden={nextButtonHidden}
              isColor="info"
              isSize="large"
            >
              Continue
            </Button>
          </NavLink>
          <br />
          <br />
          {newContractAddress && (
            <code className="is-size-4">
              {newContractAddress}
            </code>
          )}
        </div>
      </div>
    );
  }
}


export default DeployToken;
