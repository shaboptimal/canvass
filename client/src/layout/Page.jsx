import React from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';

const style = {
  container: {
    width: '100%',
    height: '100%',
  },
  content: {
    width: '70%',
    margin: '0.5em auto',
  },
};

const Page = ({ children }) => (
  <div style={style.container}>
    <div style={style.content}>
      <NavBar />
      {children}
    </div>
  </div>
);

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Page;
