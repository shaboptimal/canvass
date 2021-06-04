import React from 'react';
import { render } from '@testing-library/react';
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

export { renderInRoute };
