import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message } from 'semantic-ui-react';
import LoadStates from './Enums';

const VoterEditor = ({
  voter,
  submit,
  updateVoter,
  loadState,
  error,
}) => (
  <Form error={loadState === LoadStates.ERROR} loading={loadState === LoadStates.LOADING}>
    {console.log(loadState, voter)}
    <Form.Input
      key={`name-${voter.uuid}`}
      label="Name:"
      defaultValue={voter.name}
      onChange={(e) => updateVoter({ name: e.target.value })}
      required
    />
    <Form.Input
      key={`email-${voter.uuid}`}
      label="Email:"
      defaultValue={voter.email}
      onChange={(e) => updateVoter({ email: e.target.value })}
    />
    <Form.TextArea
      key={`notes-${voter.uuid}`}
      label="Notes:"
      onChange={(e) => updateVoter({ notes: e.target.value })}
      defaultValue={voter.notes}
    />
    <Button primary onClick={submit}>Save</Button>
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
