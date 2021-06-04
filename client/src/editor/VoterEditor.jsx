import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message } from 'semantic-ui-react';
import { LoadStates } from '../util/api';

/*
 * Form component for editing voter notes.
 */
const VoterEditor = ({
  voter,
  submit,
  updateVoter,
  loadState,
  error,
}) => (
  <Form
    onSubmit={submit}
    error={loadState === LoadStates.ERROR}
    loading={loadState === LoadStates.LOADING}
  >
    <Form.Input
      id="nameInput"
      label={{ children: 'Name:', htmlFor: 'nameInput' }}
      defaultValue={voter.name}
      onChange={(e) => updateVoter({ name: e.target.value })}
      required
    />
    <Form.Input
      id="emailInput"
      label={{ children: 'Email:', htmlFor: 'emailInput' }}
      type="email"
      defaultValue={voter.email}
      onChange={(e) => updateVoter({ email: e.target.value })}
    />
    <Form.TextArea
      id="notesInput"
      label={{ children: 'Notes:', htmlFor: 'notesInput' }}
      onChange={(e) => updateVoter({ notes: e.target.value })}
      defaultValue={voter.notes}
    />
    <Button primary type="submit">Save</Button>
    {loadState === LoadStates.SAVED && <Message positive header="Changes saved successfully." />}
    <Message error header="Encountered an error." content={error} />
  </Form>
);

VoterEditor.propTypes = {
  // Voter object
  voter: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    notes: PropTypes.string,
  }),
  // Function to call on submitting the form.
  submit: PropTypes.func.isRequired,
  // Function to update the voter object from user input.
  // Should accept a single parameter, an object with the keys and values to update in the voter.
  updateVoter: PropTypes.func.isRequired,
  // LoadStates enum describing the request to load voter data.
  loadState: PropTypes.oneOf(Object.values(LoadStates)),
  // An error message to display
  error: PropTypes.string,
};

VoterEditor.defaultProps = {
  voter: {},
  loadState: LoadStates.IDLE,
  error: '',
};

export default VoterEditor;
