import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import VoterEditor from './VoterEditor';
import { load, LoadStates } from '../util/load';

const VoterEditorContainer = () => {
  const { id } = useParams();
  const history = useHistory();
  const [voter, setVoter] = useState({});
  const [loadState, setLoadState] = useState(LoadStates.IDLE);
  const [error, setError] = useState();

  const save = () => {
    let method = 'POST';
    let path = '/api/voters';
    if (id) {
      method = 'PUT';
      path = `${path}/${id}`;
    }
    return fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(voter),
    });
  };

  const onSaveSuccess = (upserted) => {
    setVoter(upserted);
    if (!id) {
      history.push(`/voter/${upserted.uuid}`);
    }
  };

  const submit = () => load(save, onSaveSuccess, setLoadState, setError, true);

  const fetchVoter = () => {
    if (!id) {
      setVoter({});
      setLoadState(LoadStates.IDLE);
    } else if (id !== voter.uuid) {
      load(() => fetch(`/api/voters/${id}`), setVoter, setLoadState, setError);
    }
  };

  useEffect(fetchVoter, [id]);

  const updateVoter = (changes) => {
    const newValue = { ...voter, ...changes };
    setVoter(newValue);
  };

  return (
    <VoterEditor
      key={`editor-${voter.uuid}`}
      voter={voter}
      submit={submit}
      updateVoter={updateVoter}
      loadState={loadState}
      error={error}
    />
  );
};

export default VoterEditorContainer;
