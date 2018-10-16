import React, { Component } from 'react';
<<<<<<< HEAD
import { Button } from 'bloomer';
=======
>>>>>>> ef0d9469603afa947f1902fef2c36f8e6dbd2c5a
import Hero from '../Hero';

class Migration extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Hero />
<<<<<<< HEAD
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
=======
        <div className="container">
          Migration
>>>>>>> ef0d9469603afa947f1902fef2c36f8e6dbd2c5a
        </div>
      </div>
    );
  }
}

export default Migration;
