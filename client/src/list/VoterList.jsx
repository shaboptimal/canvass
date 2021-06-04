import React from 'react';
import PropTypes from 'prop-types';
import { Button, Menu } from 'semantic-ui-react';

/*
 * Component for showing a list of voters.
 */
const VoterList = ({ voters, onClick, csvUrl }) => (
  voters.length === 0
    ? <div>No voters. Click the Add Voter button to start!</div>
    : (
      <div>
        <Menu vertical fluid>
          {voters.map((v) => (
            <Menu.Item key={v.uuid} onClick={() => onClick(v.uuid)}>
              <Menu.Header>{v.name}</Menu.Header>
              {v.email}
            </Menu.Item>
          ))}
        </Menu>
        <a download href={csvUrl}>
          <Button primary>Download CSV</Button>
        </a>
      </div>
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
  // URL to download a CSV.
  csvUrl: PropTypes.string,
};

VoterList.defaultProps = {
  onClick: () => {},
  csvUrl: '',
};

export default VoterList;
