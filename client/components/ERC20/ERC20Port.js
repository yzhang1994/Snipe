import React, { Component } from 'react';
import { Input, Button, Label } from 'bloomer';
import { getEvents, tokenBalanceOfPromise } from '../../utils/erc20';


class ERC20Port extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      code: [],
      buttonLoading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitContract = this.submitContract.bind(this);
  }

  async submitContract() {
    const { address } = this.state;
    this.setState({ buttonLoading: true });

    const transfers = await getEvents(address);
    console.log('transfers', transfers);

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
    console.log('balArray', balArray);

    const messages = [];
    balArray.forEach((bal, i) => {
      const holder = Object.keys(holdersMap)[i];
      const msg = `${holder} : ${bal}`;
      messages.push(msg);
    });
    console.log('messages', messages);

    this.setState({ code: messages, buttonLoading: false });
  }

  handleChange(e) {
    this.setState({ address: e.target.value });
  }

  render() {
    const { address, code, buttonLoading } = this.state;
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
            onClick={this.submitContract}
          >
            Submit
          </Button>
          <br />
          <br />
          <code>
            {code.map((line) => {
              return (
                <div key={line}>{line}</div>
              );
            })}
          </code>
        </div>
      </div>
    );
  }
}


export default ERC20Port;
