import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { v4 as uuidV4 } from 'uuid'; 
import VoterListContainer from '../../list/VoterListContainer';
import { renderInRoute } from '../../testUtils';
import * as api from '../../util/api';

const VOTERS = [{
  uuid: uuidV4(),
  name: 'Test Voter 1',
  email: 'test@voter.one',
}, {
  uuid: uuidV4(),
  name: 'Test Voter 2',
  email: 'test@voter.two'
}];

describe('VoterListContainer', () => {

  beforeEach(() => {
    fetch.resetMocks();
    jest.restoreAllMocks();
  });

  test('Renders a message when there are no voters', async () => {
    fetch.mockResponse(JSON.stringify([]));
    render(<VoterListContainer />);
    const emptyList = await screen.findByText('No voters. Click the Add Voter button to start!'); 
    expect(emptyList).toBeInTheDocument();
    const csvButton = await screen.queryByText('Download CSV');
    expect(csvButton).toBeFalsy();
  });

  test('Renders names, emails, and CSV button when there are voters', async () => {
    fetch.mockResponse(JSON.stringify(VOTERS));
    render(<VoterListContainer />);
    expect(await screen.findByText(VOTERS[0].name)).toBeInTheDocument(); 
    expect(await screen.findByText(VOTERS[0].email)).toBeInTheDocument(); 
    expect(await screen.findByText(VOTERS[1].name)).toBeInTheDocument(); 
    expect(await screen.findByText(VOTERS[1].email)).toBeInTheDocument(); 
    const csvButton = await screen.getByText('Download CSV');
    expect(csvButton).toBeInTheDocument();
    expect(csvButton.closest('a')).toHaveAttribute('href', 'http://localhost:5000/api/voters?format=csv&download=true');
  });

  test('Renders an error message when there is an error', async () => {
    fetch.mockReject(new Error('Test error'));
    render(<VoterListContainer />);
    expect(await screen.findByText('Error loading voters')).toBeInTheDocument(); 
    expect(await screen.findByText('Test error')).toBeInTheDocument(); 
  });

  test('Renders a loading indicator when loading', async () => {
    jest.spyOn(api, 'load').mockImplementation(
      async (callApi, postProcess, setLoadState, setError, isSave) => {
        setLoadState(api.LoadStates.LOADING);
      });
    render(<VoterListContainer />);
    expect(await screen.findByText('Loading')).toBeInTheDocument(); 
  });

  test('Navigates on click', async () => {
    fetch.mockResponse(JSON.stringify(VOTERS));
    renderInRoute(<VoterListContainer />, '/list', '/list', `/voter/${VOTERS[0].uuid}`);
    fireEvent.click(await screen.findByText(VOTERS[0].name));
    expect(await screen.findByText('Pushed!')).toBeInTheDocument();
  });

});
