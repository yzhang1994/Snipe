import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'bloomer';
import Hero from '../Hero';

class Mapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoading: false,
      nextButtonHidden: true,
    };
    this.generateMapping = this.generateMapping.bind(this);
  }

  async generateMapping() {
    this.setState({ buttonLoading: true });
    const { balances, setParentState } = this.props;
    // this.hashgraphAddresses = {};
    const bals = Object.keys(balances);
    const hashgraphAddresses = {};

    let index = 0;
    while (index < bals.length) {
      const holder = bals[index];
      let mappingResponse;
      try {
        mappingResponse = await axios.post('http://localhost:7000/account', {}, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
      } catch (e) { console.error(e); }
      if (mappingResponse.data) {
        console.log(mappingResponse.data);
        hashgraphAddresses[holder] = mappingResponse.data.public_key || 'Unknown';
      }
      index += 1;
    }

    setParentState({ hashgraphAddresses });
    this.setState({ buttonLoading: false, nextButtonHidden: false });
  }

  render() {
    const { balances, hashgraphAddresses } = this.props;
    const { buttonLoading, nextButtonHidden } = this.state;

    return (
      <div>
        <Hero />
        <div className="container has-text-centered">
          <br />
          <Button
            isColor="dark"
            isLoading={buttonLoading}
            isSize="large"
            onClick={this.generateMapping}
          >
            Generate Mapping
          </Button>
          &nbsp;
          <NavLink to="/migration">
            <Button
              isHidden={nextButtonHidden}
              isColor="info"
              isSize="large"
            >
              Continue
            </Button>
          </NavLink>
          <br />
          <code>
            {Object.keys(balances).map((holder) => {
              return (
                <div key={holder}>{holder} : {hashgraphAddresses[holder]}</div>
              );
            })}
          </code>
        </div>
      </div>
    );
  }
}

export default Mapping;
