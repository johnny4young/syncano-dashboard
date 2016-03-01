import React from 'react';

import {DialogsMixin} from '../../mixins';

import Actions from './GroupsActions';
import UserActions from '../Users/UsersActions';

import {MenuItem} from 'syncano-material-ui';
import {ColumnList, Color} from 'syncano-components';

let Column = ColumnList.Column;

export default React.createClass({
  displayName: 'GroupsListItem',

  mixins: [
    DialogsMixin
  ],

  render() {
    const {item, onIconClick, showDeleteDialog} = this.props;

    return (
      <ColumnList.Item
        checked={item.checked}
        key={item.id}>
        <Column.CheckIcon
          id={item.id.toString()}
          iconClassName='arrow-up-bold'
          background={Color.getColorByName('blue', 'xlight')}
          checked={item.checked}
          handleIconClick={onIconClick}
          className="col-flex-1"
          primaryText={item.label}
          secondaryText={`ID: ${item.id}`}/>
        <Column.Menu>
          <MenuItem
            className="dropdown-item-add"
            onTouchTap={() => UserActions.showDialog(null, item)}
            primaryText="Add a User" />
          <MenuItem
            className="dropdown-item-edit"
            onTouchTap={() => Actions.showDialog(item)}
            primaryText="Edit a Group" />
          <MenuItem
            className="dropdown-item-delete"
            onTouchTap={showDeleteDialog}
            primaryText="Delete a Group" />
        </Column.Menu>
      </ColumnList.Item>
    );
  }
});
