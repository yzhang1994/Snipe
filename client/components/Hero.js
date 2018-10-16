import React from 'react';
import { NavLink } from 'react-router-dom';


const Hero = () => {
  const isActive = str => (window.location.href.includes(str) ? 'is-active' : '');

  return (
    <div className="hero is-light">
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
      <div className="hero-foot">
        <nav className="tabs is-boxed is-fullwidth">
          <div className="container">
            <ul>
              <li className={isActive('/erc20')}>
                <NavLink to="/erc20"> Get Snapshot </NavLink>
              </li>
              <li className={isActive('/deploy')}>
                <NavLink to="/deploy"> Deploy Token </NavLink>
              </li>
              <li className={isActive('/mapping')}>
                <NavLink to="/mapping"> Generate Hashgraph Mapping </NavLink>
              </li>
              <li className={isActive('/migration')}>
                <NavLink to="/migration"> Migrate Contract </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Hero;
