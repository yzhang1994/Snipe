import React, { Component } from 'react';
import { Input, Button, Label } from 'bloomer';

class ERC20Port extends Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <div className="hero is-light is-medium">
          <div className="hero-body container has-text-centered">
            <img src="/images/logo.png" width="200px" alt="logo" />
            <br />
            <h1 className="title is-1">
              Snipe
            </h1>
            <h3 className="is-size-5">
              A Data Port between Ethereum and Hashgraph
            </h3>
          </div>
        </div>
        <div className="container section has-text-centered">
          <Label className="is-size-5">Enter your ERC20 Token Address</Label>
          <br />
          <Input name="address" />
          <br />
          <br />
          <Button isColor="dark" isSize="large">Submit</Button>
        </div>
      </div>
    );
  }
}


export default ERC20Port;
