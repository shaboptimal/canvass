import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';

const VoterList = ({ voters, onClick }) => (
  voters.length === 0
    ? <div>No voters. Click the Add Voter button to start!</div>
    : (
      <Menu vertical fluid>
        {voters.map((v) => (
          <Menu.Item key={v.uuid} onClick={() => onClick(v.uuid)}>
            <Menu.Header>{v.name}</Menu.Header>
            {v.email}
          </Menu.Item>
        ))}
      </Menu>
    )
);

VoterList.propTypes = {
  voters: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  })).isRequired,
  onClick: PropTypes.func,
};

VoterList.defaultProps = {
  onClick: () => {},
};

export default VoterList;
