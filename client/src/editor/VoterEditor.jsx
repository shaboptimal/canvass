import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message } from 'semantic-ui-react';
import LoadStates from '../constants/Enums';

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
      label="Name:"
      defaultValue={voter.name}
      onChange={(e) => updateVoter({ name: e.target.value })}
      required
    />
    <Form.Input
      label="Email:"
      type="email"
      defaultValue={voter.email}
      onChange={(e) => updateVoter({ email: e.target.value })}
    />
    <Form.TextArea
      label="Notes:"
      onChange={(e) => updateVoter({ notes: e.target.value })}
      defaultValue={voter.notes}
    />
    <Button primary type="submit">Save</Button>
    {loadState === LoadStates.SAVED && <Message positive header="Changes saved successfully" />}
    <Message error header="Encountered an error" content={error} />
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
