import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Loader, Message } from 'semantic-ui-react';
import VoterList from './VoterList';

const VoterListContainer = () => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState();

  const load = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/voters');
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const newVoters = await response.json();
      setVoters(newVoters);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(load, []);

  if (error) {
    return (
      <Message negative>
        <Message.Header>Error loading voters</Message.Header>
        {error}
      </Message>
    );
  }

  if (loading) {
    return <Loader active>Loading</Loader>;
  }

  return <VoterList voters={voters} onClick={(id) => history.push(`/voter/${id}`)} />;
};

export default VoterListContainer;
