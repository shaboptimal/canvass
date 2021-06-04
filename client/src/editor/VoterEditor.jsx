import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message } from 'semantic-ui-react';
import { LoadStates } from '../util/api';

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
      label="Email:"
      type="email"
      defaultValue={voter.email}
      onChange={(e) => updateVoter({ email: e.target.value })}
    />
    <Form.TextArea
      id="notesInput"
      label={{ children: "Notes:", htmlFor: 'notesInput' }}
      onChange={(e) => updateVoter({ notes: e.target.value })}
      defaultValue={voter.notes}
    />
    <Button primary type="submit">Save</Button>
    {loadState === LoadStates.SAVED && <Message positive header="Changes saved successfully." />}
    <Message error header="Encountered an error." content={error} />
  </Form>
);

VoterEditor.propTypes = {
  voter: PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    notes: PropTypes.string,
  }),
  submit: PropTypes.func.isRequired,
  updateVoter: PropTypes.func.isRequired,
  loadState: PropTypes.oneOf(Object.values(LoadStates)),
  error: PropTypes.string,
};

VoterEditor.defaultProps = {
  voter: {},
  loadState: LoadStates.IDLE,
  error: '',
};

export default VoterEditor;
