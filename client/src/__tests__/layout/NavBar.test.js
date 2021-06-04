import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderInRoute } from '../../testUtils';
import NavBar from '../../layout/NavBar';

describe('NavBar', () => {

  test('Shows add voter when selected, and no edit voter tab', async () => {
    renderInRoute(<NavBar />, '/voter');
    const listVotersButton = screen.getByText("List Voters");
    expect(listVotersButton).toBeInTheDocument();
    expect(listVotersButton.className).not.toContain('active');
    const addVoterButton = screen.getByText("Add Voter");
    expect(addVoterButton).toBeInTheDocument();
    expect(addVoterButton.className).toContain('active');
    const editVoterButton = screen.queryByText("Edit Voter");
    expect(editVoterButton).toBeFalsy();
  });

  test('Shows list voters when selected, and no edit voter tab', async () => {
    renderInRoute(<NavBar />, '/list');
    const listVotersButton = screen.getByText("List Voters");
    expect(listVotersButton).toBeInTheDocument();
    expect(listVotersButton.className).toContain('active');
    const addVoterButton = screen.getByText("Add Voter");
    expect(addVoterButton).toBeInTheDocument();
    expect(addVoterButton.className).not.toContain('active');
    const editVoterButton = screen.queryByText("Edit Voter");
    expect(editVoterButton).toBeFalsy();
  });

  test('Shows edit voters when selected', async () => {
    renderInRoute(<NavBar />, '/voter/1');
    const listVotersButton = screen.getByText("List Voters");
    expect(listVotersButton).toBeInTheDocument();
    expect(listVotersButton.className).not.toContain('active');
    const addVoterButton = screen.getByText("Add Voter");
    expect(addVoterButton).toBeInTheDocument();
    expect(addVoterButton.className).not.toContain('active');
    const editVoterButton = screen.getByText("Edit Voter");
    expect(editVoterButton.className).toContain('active');
  });

  test('Navigates On Click', async () => {
    renderInRoute(<NavBar />, '/voter', '/voter', '/list');
    let addVoterButton = screen.getByText("Add Voter");
    let listVotersButton = screen.getByText("List Voters");
    expect(addVoterButton.className).toContain('active');  
    expect(listVotersButton.className).not.toContain('active');
    fireEvent.click(listVotersButton);
    expect(await screen.findByText('Pushed!')).toBeInTheDocument();
    addVoterButton = screen.getByText("Add Voter");
    listVotersButton = screen.getByText("List Voters");
    expect(listVotersButton.className).toContain('active');
    expect(addVoterButton.className).not.toContain('active');
  });

});
