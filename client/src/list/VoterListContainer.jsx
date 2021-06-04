import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Loader, Message } from 'semantic-ui-react';
import VoterList from './VoterList';
import { votersApi, load, LoadStates } from '../util/api';

const VoterListContainer = () => {
  const history = useHistory();

  const [loadState, setLoadState] = useState(LoadStates.IDLE);
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState();

  useEffect(() => load(votersApi.getAll, setVoters, setLoadState, setError), []);

  if (loadState === LoadStates.ERROR) {
    return (
      <Message negative>
        <Message.Header>Error loading voters</Message.Header>
        {error}
      </Message>
    );
  }

  if (loadState === LoadStates.LOADING) {
    return <Loader active>Loading</Loader>;
  }

  return <VoterList voters={voters} onClick={(id) => history.push(`/voter/${id}`)} />;
};

export default VoterListContainer;
