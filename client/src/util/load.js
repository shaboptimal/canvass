const LoadStates = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SAVED: 'SAVED',
  ERROR: 'ERROR',
};

const load = async (
  retrieve, postProcess, setLoadState, setError, isSave,
) => {
  setError('');
  setLoadState(LoadStates.LOADING);
  try {
    const response = await retrieve();
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

export { load, LoadStates };
