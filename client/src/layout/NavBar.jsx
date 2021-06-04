import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Paths from '../constants/Paths';

/*
 * Top navigation bar.
 */
const NavBar = () => {
  const history = useHistory();
  const editorMatch = useRouteMatch(Paths.editor);
  const listMatch = useRouteMatch(Paths.list);
  const editingExisting = !!(editorMatch?.params?.id);

  const handleItemClick = (e, { target }) => {
    history.push(target);
  };

  return (
    <Menu inverted>
      <Menu.Item
        name="Add Voter"
        target="/voter"
        active={editorMatch && !editingExisting}
        onClick={handleItemClick}
      />
      <Menu.Item
        name="List Voters"
        target="/list"
        active={!!listMatch}
        onClick={handleItemClick}
      />
      {editingExisting && (
        <Menu.Item
          name="Edit Voter"
          active
        />
      )}
    </Menu>
  );
};

export default NavBar;
