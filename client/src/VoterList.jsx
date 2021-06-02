import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

const VoterList = ({ voters, onClick }) => (
  voters.length === 0
    ? <div>No voters. Click the Add Voter button to start!</div>
    : (
      <List divided relaxed>
        {voters.map((v) => (
          <List.Item key={v.uuid} onClick={() => onClick(v.uuid)}>
            <List.Header>{v.name}</List.Header>
            <List.Description>{v.email}</List.Description>
          </List.Item>
        ))}
      </List>
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
