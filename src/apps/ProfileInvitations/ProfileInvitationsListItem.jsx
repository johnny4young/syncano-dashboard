import React from 'react';

import {MenuItem, Styles} from 'syncano-material-ui';
import {ColumnList} from '../../common';
import {Truncate} from 'syncano-components';

let Column = ColumnList.Column;

export default React.createClass({
  displayName: 'ProfileInvitationsListItem',

  render() {
    let item = this.props.item;

    return (
      <ColumnList.Item
        checked={item.checked}
        key={item.id}>
        <Column.CheckIcon
          id={item.id.toString()}
          icon='account'
          background={Styles.Colors.blue500}
          checked={item.checked}
          handleIconClick={this.props.onIconClick}>
          <Truncate text={item.instance}/>
        </Column.CheckIcon>
        <Column.Desc>{item.inviter}</Column.Desc>
        <Column.Desc>{item.role}</Column.Desc>
        <Column.Date date={item.created_at}/>
        <Column.Menu>
          <MenuItem
            className="dropdown-item-invitation-accept"
            onTouchTap={this.props.showAcceptDialog}
            primaryText="Accept Invitation"/>
          <MenuItem
            className="dropdown-item-invitation-decline"
            onTouchTap={this.props.showDeclineDialog}
            primaryText="Decline Invitation"/>
        </Column.Menu>
      </ColumnList.Item>
    );
  }
});
