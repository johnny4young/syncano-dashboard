import React from 'react';

// Utils
import {DialogsMixin} from '../../mixins';

// Stores and Actions
import Actions from './InstancesActions';
import Store from './InstancesStore';
import SessionStore from '../Session/SessionStore';

import ListItem from './InstancesListItem';
import {Loading, ColumnList, Dialog, Lists} from '../../common/';

const Column = ColumnList.Column;

export default React.createClass({
  displayName: 'SharedInstancesList',

  mixins: [DialogsMixin],

  handleCheckInstance(checkId, value) {
    Actions.uncheckAll('myInstances');
    Actions.checkItem(checkId, value, 'name', 'sharedInstances');
  },

  initDialogs() {
    const {isLoading} = this.props;

    return [{
      dialog: Dialog.Delete,
      params: {
        key: 'deleteSharedInstanceDialog',
        ref: 'deleteSharedInstanceDialog',
        title: 'Leave shared Instance',
        handleConfirm: Actions.removeSharedInstance,
        handleConfirmParam: SessionStore.getUser().id,
        actionName: 'leave',
        items: Store.getCheckedItems('sharedInstances'),
        groupName: 'Instance',
        isLoading
      }
    }];
  },

  renderItem(item) {
    return (
      <ListItem
        key={`shared-instances-list-item-${item.name}`}
        onIconClick={this.handleCheckInstance}
        item={item}
        showDeleteDialog={() => this.showDialog('deleteSharedInstanceDialog', item)}/>
    );
  },

  render() {
    const {isLoading, ...other} = this.props;
    const checkedItems = Store.getNumberOfChecked('sharedInstances');

    return (
      <Loading show={isLoading}>
        <Lists.Container className='instances-list'>
          {this.getDialogs()}
          <ColumnList.Header>
            <Column.ColumnHeader
              primary={true}
              columnName="CHECK_ICON">
              Shared with me
            </Column.ColumnHeader>
            <Column.ColumnHeader columnName="DESC">Description</Column.ColumnHeader>
            <Column.ColumnHeader columnName="DATE">Created</Column.ColumnHeader>
            <Column.ColumnHeader columnName="MENU">
              <Lists.Menu
                checkedItemsCount={checkedItems}
                handleSelectAll={() => Actions.selectAll('sharedInstances')}
                handleUnselectAll={() => Actions.uncheckAll('sharedInstances')}>
                <Lists.MenuItem
                  primaryText="Leave All"
                  onTouchTap={() => this.showDialog('deleteSharedInstanceDialog')} />
              </Lists.Menu>
            </Column.ColumnHeader>
          </ColumnList.Header>
          <Lists.List
            {...other}
            key="shared-instances-list"
            renderItem={this.renderItem}/>
        </Lists.Container>
      </Loading>
    );
  }
});
