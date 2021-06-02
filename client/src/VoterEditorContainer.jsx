import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import VoterEditor from './VoterEditor';
import LoadStates from './Enums';

const VoterEditorContainer = () => {
  const { id } = useParams();
  const history = useHistory();
  const [voter, setVoter] = useState({});
  const [loadState, setLoadState] = useState(LoadStates.IDLE);
  const [error, setError] = useState();

  const submit = async () => {
    setError('');
    setLoadState(LoadStates.LOADING);
    let method = 'POST';
    let path = '/api/voters';
    if (id) {
      method = 'PUT';
      path = `${path}/${id}`;
    }
    try {
      const response = await fetch(path, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voter),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      const newVoter = await response.json();
      setVoter(newVoter);
      if (!id) {
        history.push(`/voter/${newVoter.uuid}`);
      }
      setLoadState(LoadStates.SAVED);
    } catch (e) {
      console.error(e);
      setLoadState(LoadStates.ERROR);
      setError(e.message);
    }
  };

  const load = async () => {
    if (!id) {
      setVoter({});
      return;
    }
    if (voter.uuid === id) {
      return;
    }
    try {
      setLoadState(LoadStates.LOADING);
      const response = await fetch(`/api/voters/${id}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      const newVoter = await response.json();
      setVoter(newVoter);
      setLoadState(LoadStates.IDLE);
    } catch (e) {
      console.error(e);
      setLoadState(LoadStates.ERROR);
      setError(e.message);
    }
  };

  useEffect(load, [id]);

  const updateVoter = (changes) => {
    const newValue = { ...voter, ...changes };
    console.log(changes, newValue);
    setVoter(newValue);
  };

  return (
    <VoterEditor
      voter={voter}
      submit={submit}
      updateVoter={updateVoter}
      loadState={loadState}
      error={error}
    />
  );
};

export default VoterEditorContainer;
