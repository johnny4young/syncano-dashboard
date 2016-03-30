import React from 'react';
import {State, Navigation} from 'react-router';

import Actions from './ScriptsActions';
import Store from './ScriptsStore';

import {MenuItem} from 'syncano-material-ui';
import {ColumnList, Truncate} from 'syncano-components';

const Column = ColumnList.Column;

export default React.createClass({
  displayName: 'ScriptsListItem',

  mixins: [
    State,
    Navigation
  ],

  handleItemClick(itemId) {
    this.transitionTo('script', {
      instanceName: this.getParams().instanceName,
      scriptId: itemId
    });
  },

  render() {
    const {item, onIconClick, showDeleteDialog} = this.props;
    const runtime = Store.getRuntimeColorIcon(item.runtime_name) || {};

    return (
      <ColumnList.Item
        checked={item.checked}
        key={item.id}
        id={item.id}>
        <Column.CheckIcon
          id={item.id.toString()}
          iconClassName={runtime.icon}
          background={runtime.color}
          checked={item.checked}
          handleIconClick={onIconClick}
          primaryText={
            <Truncate
              onClick={() => this.handleItemClick(item.id)}
              text={item.label}
              style={{cursor: 'pointer'}}/>
          }
          secondaryText={`ID: ${item.id}`}/>
        <Column.Desc>{item.description}</Column.Desc>
        <Column.Date date={item.created_at}/>
        <Column.Menu>
          <MenuItem
            className="dropdown-item-script-edit"
            onTouchTap={() => Actions.showDialog(item)}
            primaryText="Edit a Script" />
          <MenuItem
            className="dropdown-item-script-delete"
            onTouchTap={showDeleteDialog}
            primaryText="Delete a Script" />
        </Column.Menu>
      </ColumnList.Item>
    );
  }
});
