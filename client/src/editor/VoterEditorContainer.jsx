import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import VoterEditor from './VoterEditor';
import { votersApi, load, LoadStates } from '../util/api';

const VoterEditorContainer = () => {
  const { id } = useParams();
  const history = useHistory();
  const [voter, setVoter] = useState({});
  const [loadState, setLoadState] = useState(LoadStates.IDLE);
  const [error, setError] = useState();

  const save = id
    ? () => votersApi.put(voter)
    : () => votersApi.post(voter);

  const onSaveSuccess = (upserted) => {
    setVoter(upserted);
    if (!id) {
      history.push(`/voter/${upserted.uuid}`);
    }
  };

  const submit = () => load(save, onSaveSuccess, setLoadState, setError, true);

  useEffect(() => {
    if (!id) {
      setVoter({});
      setLoadState(LoadStates.IDLE);
    } else if (id !== voter.uuid) {
      load(() => votersApi.getById(id), setVoter, setLoadState, setError);
    }
  }, [id]);

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
