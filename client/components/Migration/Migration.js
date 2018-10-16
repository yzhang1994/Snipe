import React, { Component } from 'react';
import { Button } from 'bloomer';
import Hero from '../Hero';

class Migration extends Component {
  componentDidMount() {
  }

  render() {
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
            // isLoading={buttonLoading}
            isSize="large"
            onClick={this.setBalance}
          >
            Write to TestRPC
          </Button>
        </div>
      </div>
    );
  }
}

export default Migration;
