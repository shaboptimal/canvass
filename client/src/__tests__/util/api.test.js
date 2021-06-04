import { v4 as uuidV4 } from 'uuid';
import * as api from '../../util/api';

const VOTER_ID = uuidV4();
const VOTER = {
  id: 1,
  uuid: VOTER_ID.toString(),
  name: 'Foo Bar',
  email: 'foo@bar.baz',
  notes: 'Qux',
};

describe('api', () => {

  beforeEach(() => {
    fetch.resetMocks();
  });

  describe('votersApi', () => {
    test('Calls correct endpoint for getAll', async () => {
      fetch.mockIf(/^\/api\/voters$/, (req) => {
        if (req.method === 'GET') {
          return Promise.resolve(JSON.stringify([VOTER]));
        }
        return Promise.reject('wrong method');
      });
      const response = await api.votersApi.getAll();
      expect(await response.json()).toEqual([VOTER]);
    });

    test('Calls correct endpoint for getById', async () => {
      fetch.mockIf(/^\/api\/voters\/.+$/, (req) => {
        if (req.method === 'GET' && req.url.endsWith(VOTER_ID)) {
          return Promise.resolve(JSON.stringify(VOTER));
        }
        return Promise.reject('wrong path or method');
      });
      const response = await api.votersApi.getById(VOTER_ID);
      expect(await response.json()).toEqual(VOTER);
    });

    test('Calls correct endpoint for post', async () => {
      fetch.mockIf(/^\/api\/voters$/, async (req) => {
        if (req.method === 'POST') {
          const body = await req.json();
          return Promise.resolve(JSON.stringify(body));
        }
        return Promise.reject('wrong method');
      });
      const response = await api.votersApi.post(VOTER);
      expect(await response.json()).toEqual(VOTER);
    });

    test('Calls correct endpoint for put', async () => {
      fetch.mockIf(/^\/api\/voters\/.+$/, async (req) => {
        if (req.method === 'PUT' && req.url.endsWith(VOTER_ID)) {
          const body = await req.json();
          return Promise.resolve(JSON.stringify(body));
        }
        return Promise.reject('wrong path or method');
      });
      const response = await api.votersApi.put(VOTER);
      expect(await response.json()).toEqual(VOTER);
    });
  });

  describe('load', () => {

    const mocks = {
      callApi: jest.fn(),
      postProcess: jest.fn(),
      setLoadState: jest.fn(),
      setError: jest.fn(),
    };

    beforeEach(() => {
      Object.keys(mocks).forEach(k => mocks[k].mockReset());
    });

    test('Sets IDLE state after load', async () => {
      const { callApi, postProcess, setLoadState, setError } = mocks;
      callApi.mockReturnValue(Promise.resolve({ ok: true, json: () => Promise.resolve(VOTER) }));
      await api.load(callApi, postProcess, setLoadState, setError, false);
      expect(setError).toHaveBeenCalledWith('');
      expect(postProcess).toHaveBeenCalledWith(VOTER);
      expect(setLoadState.mock.calls).toEqual([[api.LoadStates.LOADING], [api.LoadStates.IDLE]]);
    });

    test('Sets SAVED state after load if isSave is true', async () => {
      const { callApi, postProcess, setLoadState, setError } = mocks;
      callApi.mockReturnValue(Promise.resolve({ ok: true, json: () => Promise.resolve(VOTER) }));
      await api.load(callApi, postProcess, setLoadState, setError, true);
      expect(setError).toHaveBeenCalledWith('');
      expect(postProcess).toHaveBeenCalledWith(VOTER);
      expect(setLoadState.mock.calls).toEqual([[api.LoadStates.LOADING], [api.LoadStates.SAVED]]);
    });

    test('Sets ERROR state and message after non-ok response', async () => {
      const { callApi, postProcess, setLoadState, setError } = mocks;
      callApi.mockReturnValue(Promise.resolve({ ok: false, text: () => Promise.resolve('Test error') }));
      await api.load(callApi, postProcess, setLoadState, setError, false);
      expect(setError.mock.calls).toEqual([[''], ['Test error']]);
      expect(postProcess).not.toHaveBeenCalled();
      expect(setLoadState.mock.calls).toEqual([[api.LoadStates.LOADING], [api.LoadStates.ERROR]]);
    });

  });

});
