import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { v4 as uuidV4} from 'uuid';
import { renderInRoute } from '../../testUtils';
import VoterEditorContainer from '../../editor/VoterEditorContainer';

const VOTER_ID = uuidV4();
const VOTER = {
  id: 1,
  uuid: VOTER_ID.toString(),
  name: 'Foo Bar',
  email: 'foo@bar.baz',
  notes: 'Qux',
};

describe('VoterEditorContainer', () => {

  beforeEach(() => {
    fetch.resetMocks();
    jest.restoreAllMocks();
  });

  test('Renders blank editor for no voter', async () => {
    renderInRoute(<VoterEditorContainer />, '/voter/');
    const nameField = screen.getByLabelText(/Name:/);
    expect(nameField).toBeInTheDocument();
    expect(nameField.value).toBeFalsy();
    const emailField = screen.getByLabelText(/Email:/);
    expect(emailField).toBeInTheDocument();
    expect(emailField.value).toBeFalsy();
    const notesField = screen.getByLabelText(/Notes:/);
    expect(notesField).toBeInTheDocument();
    expect(notesField.value).toBeFalsy();
    const saveButton = screen.getByText(/Save/);
    expect(saveButton).toBeInTheDocument();
  });

  test('Renders populated editor for voter', async () => {
    fetch.mockResponse(JSON.stringify(VOTER));
    renderInRoute(<VoterEditorContainer />, '/voter/:id', `/voter/${VOTER_ID}`);
    
    await screen.findByDisplayValue(VOTER.name);

    const nameField = screen.getByLabelText(/Name:/);
    expect(nameField).toBeInTheDocument();
    expect(nameField.value).toEqual(VOTER.name);
    const emailField = screen.getByLabelText(/Email:/);
    expect(emailField).toBeInTheDocument();
    expect(emailField.value).toEqual(VOTER.email);
    const notesField = screen.getByLabelText(/Notes:/);
    expect(notesField).toBeInTheDocument();
    expect(notesField.value).toEqual(VOTER.notes);
    const saveButton = screen.getByText(/Save/);
    expect(saveButton).toBeInTheDocument();
  });

  test('Posts new voter on save if not editing existing voter', async () => {
    fetch.mockIf(/.*/, async (req) => {
      if (req.method == 'POST') {
        const { id, uuid, ...update } = VOTER;
        expect(await req.json()).toEqual(update);
        return JSON.stringify(VOTER);
      } else if(req.method == 'GET') {
        return JSON.stringify(VOTER);
      }
      fail(`called wrong API method`);
    });

    renderInRoute(<VoterEditorContainer />, '/voter/', null, `/voter/${VOTER.uuid}`);
    
    const nameField = screen.getByLabelText(/Name:/);
    fireEvent.change(nameField, { target: { value: VOTER.name }});
    const emailField = screen.getByLabelText(/Email:/);
    fireEvent.change(emailField, { target: { value: VOTER.email }});
    const notesField = screen.getByLabelText(/Notes:/);
    fireEvent.change(notesField, { target: { value: VOTER.notes }});
    const saveButton = screen.getByText(/Save/);
    fireEvent.click(saveButton);

    expect(await screen.findByText('Changes saved successfully.')).toBeInTheDocument();
    expect(screen.getByText('Pushed!')).toBeInTheDocument();
  });

  test('Puts new voter on save if editing existing voter', async () => {
    const newVoter = {
      id: 1,
      uuid: VOTER_ID.toString(),
      name: 'New Voter',
      email: 'new@vo.ter',
      notes: 'Edited',
    };

    fetch.mockIf(/.*/, async (req) => {
      if (req.method == 'PUT') {
        const { id, uuid, ...update } = newVoter;
        expect(await req.json()).toEqual(update);
        return JSON.stringify(newVoter);
      } else if(req.method == 'GET') {
        return JSON.stringify(VOTER);
      }
      fail(`called wrong API method`);
    });

    renderInRoute(<VoterEditorContainer />, '/voter/:id', `/voter/${VOTER_ID}`);
    
    const nameField = screen.getByLabelText(/Name:/);
    fireEvent.change(nameField, { target: { value: newVoter.name }});
    const emailField = screen.getByLabelText(/Email:/);
    fireEvent.change(emailField, { target: { value: newVoter.email }});
    const notesField = screen.getByLabelText(/Notes:/);
    fireEvent.change(notesField, { target: { value: newVoter.notes }});
    const saveButton = screen.getByText(/Save/);
    fireEvent.click(saveButton);

    expect(await screen.findByText('Changes saved successfully.')).toBeInTheDocument();
    expect(screen.queryByText('Pushed!')).toBeFalsy();
  });

  test('Displays message on error', async () => {

    fetch.mockReject(new Error("Test error"));

    renderInRoute(<VoterEditorContainer />, '/voter/');
    
    const nameField = screen.getByLabelText(/Name:/);
    expect(nameField).toBeInTheDocument();
    expect(nameField.value).toBeFalsy();
    const emailField = screen.getByLabelText(/Email:/);
    expect(emailField).toBeInTheDocument();
    expect(emailField.value).toBeFalsy();
    const notesField = screen.getByLabelText(/Notes:/);
    expect(notesField).toBeInTheDocument();
    expect(notesField.value).toBeFalsy();
    const saveButton = screen.getByText(/Save/);
    expect(saveButton).toBeInTheDocument();
    const errorMessage = screen.getByText('Encountered an error.');
    expect(errorMessage).toBeInTheDocument();
  });

});
