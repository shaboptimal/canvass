import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';

/*
 * Component for showing a list of voters. 
 */
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
  // List of voter objects.
  voters: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  })).isRequired,
  // Function to call when a voter is clicked on.
  // Should accept a single parameter, the ID of the voter.
  onClick: PropTypes.func,
};

VoterList.defaultProps = {
  onClick: () => {},
};

export default VoterList;
