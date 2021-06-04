const votersApi = {
  getAll: () => fetch('/api/voters'),
  getById: (id) => fetch(`/api/voters/${id}`),
  post: (voter) => fetch('/api/voters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(voter),
  }),
  put: (voter) => fetch(`/api/voters/${voter.uuid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(voter),
  }),
};

const LoadStates = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SAVED: 'SAVED',
  ERROR: 'ERROR',
};

const load = async (
  callApi, postProcess, setLoadState, setError, isSave,
) => {
  setError('');
  setLoadState(LoadStates.LOADING);
  try {
    const response = await callApi();
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }
    const jsonBody = await response.json();
    postProcess(jsonBody);
    setLoadState(isSave ? LoadStates.SAVED : LoadStates.IDLE);
  } catch (e) {
    console.error(e);
    setLoadState(LoadStates.ERROR);
    setError(e.message);
  }
};

export { votersApi, load, LoadStates };
