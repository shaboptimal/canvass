const API_PATH = `${process.env.REACT_APP_BACKEND_URL}/api/voters`;

/**
 * Object with functions for calling the backend API.
 */
const votersApi = {
  getAll: () => fetch(API_PATH),
  getById: (id) => fetch(`${API_PATH}/${id}`),
  post: (voter) => fetch(API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(voter),
  }),
  put: (voter) => fetch(`${API_PATH}/${voter.uuid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(voter),
  }),
};

const CSV_URL = `${API_PATH}?format=csv&download=true`;

/*
 * Common states that components can use to track the progress of an API call.
 */
const LoadStates = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SAVED: 'SAVED',
  ERROR: 'ERROR',
};

/*
 * Helper method to make an API call and notify the caller of its progress.
 *
 * Parameters:
 *   - callApi (function): async function implementing the actual API call.
 *     Takes no arguments and returns a Response.
 *   - postProcess (function): callback invoked with the JSON body of the response.
 *   - setLoadState (function): callback invoked with a LoadStates value each time
 *     the request state changes.
 *   - setError (function): callback invoked with an error message in case of error.
 *   - isSave (boolean): true iff this request is saving data, and the final success
 *     state should be SAVED instead of IDLE.
 *
 */
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

export {
  votersApi,
  load,
  LoadStates,
  CSV_URL,
};
