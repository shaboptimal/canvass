import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Page from './layout/Page';
import Paths from './constants/Paths';
import VoterEditorContainer from './editor/VoterEditorContainer';
import VoterListContainer from './list/VoterListContainer';

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
