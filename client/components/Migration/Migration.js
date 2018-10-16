import React, { Component } from 'react';
import Hero from '../Hero';

class Migration extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Hero />
        <div className="container">
          Migration
        </div>
      </div>
    );
  }
}

export default Migration;
