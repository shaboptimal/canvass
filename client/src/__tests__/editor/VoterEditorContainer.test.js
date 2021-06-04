import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { v4 as uuidV4} from 'uuid';
import VoterEditorContainer from '../../editor/VoterEditorContainer';
import { Route, MemoryRouter as Router } from 'react-router-dom';

const renderInRoute = (component, pathTemplate, path, pushPath) => {
  return render (
    <Router initialEntries={[path ? path : pathTemplate]}>
      <Route path={pathTemplate}>
        {component}
      </Route>
      {pushPath && (
        <Route path={pushPath}>
          Pushed!
          {component}
        </Route>)}
    </Router>
  )
};

describe('VoterEditorContainer', () => {

  beforeEach(() => {
    fetch.resetMocks();
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
    const voterId = uuidV4();
    const voter = {
      id: 1,
      uuid: voterId.toString(),
      name: 'Foo Bar',
      email: 'foo@bar.baz',
      notes: 'Qux',
    };
    fetch.mockResponse(JSON.stringify(voter));
    renderInRoute(<VoterEditorContainer />, '/voter/:id', `/voter/${voterId}`);
    
    await screen.findByDisplayValue(voter.name);

    const nameField = screen.getByLabelText(/Name:/);
    expect(nameField).toBeInTheDocument();
    expect(nameField.value).toEqual(voter.name);
    const emailField = screen.getByLabelText(/Email:/);
    expect(emailField).toBeInTheDocument();
    expect(emailField.value).toEqual(voter.email);
    const notesField = screen.getByLabelText(/Notes:/);
    expect(notesField).toBeInTheDocument();
    expect(notesField.value).toEqual(voter.notes);
    const saveButton = screen.getByText(/Save/);
    expect(saveButton).toBeInTheDocument();
  });

  test('Posts new voter on save if not editing existing voter', async () => {
    const voterId = uuidV4();
    const voter = {
      id: 1,
      uuid: voterId.toString(),
      name: 'Foo Bar',
      email: 'foo@bar.baz',
      notes: 'Qux',
    };

    fetch.mockIf(/.*/, async (req) => {
      if (req.method == 'POST') {
        const { id, uuid, ...update } = voter;
        expect(await req.json()).toEqual(update);
        return JSON.stringify(voter);
      } else if(req.method == 'GET') {
        return JSON.stringify(voter);
      }
      fail(`called wrong API method`);
    });

    renderInRoute(<VoterEditorContainer />, '/voter/', null, `/voter/${voter.uuid}`);
    
    const nameField = screen.getByLabelText(/Name:/);
    fireEvent.change(nameField, { target: { value: voter.name }});
    const emailField = screen.getByLabelText(/Email:/);
    fireEvent.change(emailField, { target: { value: voter.email }});
    const notesField = screen.getByLabelText(/Notes:/);
    fireEvent.change(notesField, { target: { value: voter.notes }});
    const saveButton = screen.getByText(/Save/);
    fireEvent.click(saveButton);

    expect(await screen.findByText('Changes saved successfully.')).toBeInTheDocument();
    expect(screen.getByText('Pushed!')).toBeInTheDocument();
  });

  test('Puts new voter on save if editing existing voter', async () => {
    const voterId = uuidV4();
    const voter = {
      id: 1,
      uuid: voterId.toString(),
      name: 'Foo Bar',
      email: 'foo@bar.baz',
      notes: 'Qux',
    };

    const newVoter = {
      id: 1,
      uuid: voterId.toString(),
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
        return JSON.stringify(voter);
      }
      fail(`called wrong API method`);
    });

    renderInRoute(<VoterEditorContainer />, '/voter/:id', `/voter/${voterId}`);
    
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
