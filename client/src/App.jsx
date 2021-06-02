import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Page from './Page';
import Paths from './Paths';
import VoterEditorContainer from './VoterEditorContainer';
import VoterListContainer from './VoterListContainer';

function App() {
  return (
    <Router>
      <Page>
        <Switch>
          <Route path={Paths.editor}>
            <VoterEditorContainer />
          </Route>
          <Route path={Paths.list}>
            <VoterListContainer />
          </Route>
          <Route path="/">
            <Redirect to={Paths.list} />
          </Route>
        </Switch>
      </Page>
    </Router>
  );
}

export default App;
