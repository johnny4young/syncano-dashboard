import React from 'react';
import {Navigation, State} from 'react-router';

import {DialogsMixin} from '../../mixins';
import {Styles} from 'syncano-material-ui';

import UsersActions from '../Users/UsersActions';
import UsersStore from '../Users/UsersStore';

import {ColumnList} from 'syncano-components';
import {Container, Lists, Dialog} from '../../common';
import ListItem from './DevicesListItem';
import GCMSendMessageDialog from './GCMDevices/GCMSendMessageDialog';
import APNSSendMessageDialog from './APNSDevices/APNSSendMessageDialog';

let Column = ColumnList.Column;

export default React.createClass({
  displayName: 'DevicesList',

  mixins: [
    Navigation,
    State,
    DialogsMixin
  ],

  getInitialState() {
    return {
      clickedDevice: null
    };
  },

  componentWillMount() {
    UsersActions.fetch();
  },

  componentWillUpdate(nextProps) {
    console.info('Channels::componentWillUpdate');
    this.hideDialogs(nextProps.hideDialogs);
  },

  getStyles() {
    return {
      listTitleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px 16px 8px'
      },
      listTitle: {
        fontSize: 18
      },
      moreLink: {
        color: Styles.Colors.blue500,
        cursor: 'pointer',
        ':hover': {
          textDecoration: 'underline'
        }
      }
    };
  },

  initDialogs() {
    return [{
      dialog: Dialog.Delete,
      params: {
        key: 'deleteDeviceDialog',
        ref: 'deleteDeviceDialog',
        title: 'Delete a Device',
        handleConfirm: this.props.actions.removeDevices,
        isLoading: this.props.isLoading,
        items: this.props.getChekcedItems(),
        groupName: 'Device',
        itemLabelName: 'label'
      }
    }];
  },

  sliceItems(items) {
    if (this.props.visibleItems) {
      return this.props.items.slice(0, this.props.visibleItems);
    }

    return items;
  },

  renderMoreLink() {
    const styles = this.getStyles();

    if (this.isActive('all-devices')) {
      return (
        <span
          onClick={() => this.transitionTo(`${this.props.type}-devices`, this.getParams())}
          key={`${this.props.type}-list`}
          style={styles.moreLink}>More devices</span>
      );
    }
  },

  renderListHeader() {
    const styles = this.getStyles();
    const titleText = {
      apns: 'iOS Devices',
      gcm: 'Android Devices'
    };

    return (
      <div style={styles.listTitleContainer}>
        <span style={styles.listTitle}>{titleText[this.props.type]}</span>
        {this.renderMoreLink()}
      </div>
    );
  },

  renderItem(item) {
    const icon = {
      apns: 'apple',
      gcm: 'android'
    };
    const userName = UsersStore.getUserById(item.user_id) ? UsersStore.getUserById(item.user_id).username : 'No user';

    item.userName = userName;

    return (
      <ListItem
        key={`devices-list-item-${item.registration_id}`}
        checkedItemsCount={this.props.getChekcedItems().length}
        actions={this.props.actions}
        onIconClick={this.props.actions.checkItem}
        icon={icon[this.props.type]}
        showSendMessageDialog={() => this.props.showSendMessagesDialog(item)}
        showEditDialog={() => this.props.actions.showDialog(item)}
        showDeleteDialog={() => this.showDialog('deleteDeviceDialog', item)}
        item={item}/>
    );
  },

  render() {
    let checkedItems = this.props.getChekcedItems().length;
    let {items, ...other} = this.props;

    return (
      <div>
        {this.renderListHeader()}
        <GCMSendMessageDialog />
        <APNSSendMessageDialog />
        <Lists.Container>
          {this.getDialogs()}
          <ColumnList.Header>
            <Column.ColumnHeader
              columnName="CHECK_ICON"
              className="col-xs-14">
              Device
            </Column.ColumnHeader>
            <Column.ColumnHeader
              className="col-xs-13"
              columnName="DESC">
              User
            </Column.ColumnHeader>
            <Column.ColumnHeader columnName="DESC">
              Active
            </Column.ColumnHeader>
            <Column.ColumnHeader columnName="DATE">
              Registered
            </Column.ColumnHeader>
            <Lists.Menu
              checkedItemsCount={checkedItems}
              actions={this.props.actions}>
              <Lists.MenuItem
                singleItemText="Delete a Device"
                multipleItemsText="Delete Devices"
                onTouchTap={() => this.showDialog('deleteDeviceDialog')}/>
              <Lists.MenuItem
                singleItemText="Send message"
                multipleItemsText="Send messages"
                onTouchTap={this.props.showSendMessagesDialog}/>
            </Lists.Menu>
          </ColumnList.Header>
          <Lists.List
            {...other}
            items={this.sliceItems(items)}
            renderItem={this.renderItem}/>
        </Lists.Container>
      </div>
    );
  }
});
