import React from 'react';

// Utils
import Mixins from '../../mixins';

// Stores and Actions
import Actions from './ProfileInvitationsActions';
import Store from './ProfileInvitationsStore';

// Components
import {FlatButton} from 'syncano-material-ui';
import MenuItem from '../../../node_modules/syncano-material-ui/lib/menus/menu-item';
import Common from '../../common';
import Container from '../../common/Container/Container';
import ListItem from './ProfileInvitationsListItem';

let Column = Common.ColumnList.Column;

export default React.createClass({

  displayName: 'ProfileInvitationsList',

  mixins: [
    Mixins.Dialog,
    Mixins.Dialogs
  ],

  getInitialState() {
    return {};
  },

  componentWillUpdate(nextProps) {
    console.info('ProfileInvitations::componentWillUpdate');
    this.hideDialogs(nextProps.hideDialogs);
  },

  handleAccept() {
    console.info('ProfileInvitations::handleAccept');
    Actions.acceptInvitations(Store.getCheckedItems());
  },

  handleDecline() {
    console.info('ProfileInvitations::handleDecline');
    Actions.declineInvitations(Store.getCheckedItems());
  },

  handleItemIconClick(id, state) {
    console.info('ProfileInvitations::checkItem');
    Actions.checkItem(id, state);
  },

  initDialogs() {
    return [
      {
        dialog: Common.Dialog,
        params: {
          key: 'acceptInvitationsDialog',
          ref: 'acceptInvitationsDialog',
          title: 'Accept an Invitation',
          actions: [
            <FlatButton
              label="Cancel"
              secondary={true}
              onTouchTap={this.handleCancel.bind(null, 'acceptInvitationsDialog')}/>,
            <FlatButton
              label="Confirm"
              primary={true}
              keyboardFocused={true}
              onTouchTap={this.handleAccept}/>
          ],
          modal: true,
          children: `Do you really want to accept ${Store.getDeleteItemsPhrase('Invitation')}?`
        }
      },
      {
        dialog: Common.Dialog,
        params: {
          key: 'declineInvitationsDialog',
          ref: 'declineInvitationsDialog',
          title: 'Decline an Invitation',
          actions: [
            <FlatButton
              label="Cancel"
              secondary={true}
              onTouchTap={this.handleCancel.bind(null, 'declineInvitationsDialog')}/>,
            <FlatButton
              label="Confirm"
              primary={true}
              keyboardFocused={true}
              onTouchTap={this.handleDecline}/>
          ],
          modal: true,
          children: `Do you really want to decline ${Store.getDeleteItemsPhrase('Invitation')}?`
        }
      }
    ];
  },

  renderItem(item, index) {
    return (
      <ListItem
        key={`profileinvitationslist-${index}`}
        onIconClick={this.handleItemIconClick}
        item={item}
        showAcceptDialog={this.showDialog.bind(null, 'acceptInvitationsDialog', item)}
        showDeclineDialog={this.showDialog.bind(null, 'declineInvitationsDialog', item)}
        />
    );
  },

  render() {
    let checkedItems = Store.getNumberOfChecked();

    return (
      <Common.Lists.Container>
        {this.getDialogs()}
        <Common.ColumnList.Header>
          <Column.ColumnHeader
            primary={true}
            columnName="CHECK_ICON">
            Instance
          </Column.ColumnHeader>
          <Column.ColumnHeader columnName="DESC">From</Column.ColumnHeader>
          <Column.ColumnHeader columnName="DESC">Role</Column.ColumnHeader>
          <Column.ColumnHeader columnName="DATE">Created</Column.ColumnHeader>
          <Column.ColumnHeader columnName="MENU">
            <Common.Lists.Menu
              checkedItemsCount={checkedItems}
              actions={Actions}>
              <Common.Lists.MenuItem
                singleItemText="Accept an Invitation"
                multipleItemsText="Accept Invitations"
                onTouchTap={this.showDialog.bind(null, 'acceptInvitationsDialog')}/>
              <Common.Lists.MenuItem
                singleItemText="Decline an Invitation"
                multipleItemsText="Decline Invitations"
                onTouchTap={this.showDialog.bind(null, 'declineInvitationsDialog')}/>
            </Common.Lists.Menu>
          </Column.ColumnHeader>
        </Common.ColumnList.Header>
        <Common.Lists.List
          {...this.props}
          renderItem={this.renderItem}/>
      </Common.Lists.Container>
    );
  }
});
