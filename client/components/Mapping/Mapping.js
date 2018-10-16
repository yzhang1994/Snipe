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
    this.generateIndividualMapping = this.generateIndividualMapping.bind(this);
  }

  async generateIndividualMapping(holder) {
    // const { setParentState, hashgraphAddresses } = this.props;
    // let hashgraphAddress = 'Unknown';
    try {
      const mappingResponse = await axios.post('http://localhost:7000/account', {}, { headers: { 'Access-Control-Allow-Origin': '*' } });
      if (mappingResponse.data) {
        this.hashgraphAddress[holder] = mappingResponse.data.public_key || 'Unknown';
      }
    } catch (e) { console.error(e); }
  }

  async generateMapping() {
    const { balances, setParentState } = this.props;
    this.hashgraphAddresses = {};
    Object.keys(balances).forEach(async (holder) => {
      await this.generateIndividualMapping(holder);
    });
    setParentState({ hashgraphAddresses: this.hashgraphAddresses });
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
