import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('app', () => {

  beforeEach(() => {
    fetch.resetMocks();
  });

  test('Redirects to list view', async () => {
    fetch.mockResponse(JSON.stringify([]));
    render(<App />);
    const listVotersButton = screen.getByText("List Voters");
    expect(listVotersButton).toBeInTheDocument();
    expect(listVotersButton.className).toContain('active');
    const addVoterButton = screen.getByText("Add Voter");
    expect(addVoterButton).toBeInTheDocument();
    expect(addVoterButton.className).not.toContain('active');
    const emptyList = await screen.findByText(/No voters/); 
    expect(emptyList).toBeInTheDocument();
  });

});
