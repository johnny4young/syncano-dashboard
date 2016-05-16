import React from 'react';

// Utils
import {DialogsMixin} from '../../mixins';

// Stores and Actions
import Actions from './InstancesActions';
import Store from './InstancesStore';

import ListItem from './InstancesListItem';
import {Loading, ColumnList, Dialog, Lists} from '../../common/';

let Column = ColumnList.Column;

export default React.createClass({
  displayName: 'InstancesList',

  mixins: [DialogsMixin],

  componentWillUpdate(nextProps) {
    console.info('Channels::componentWillUpdate');
    this.hideDialogs(nextProps.hideDialogs);
  },

  handleCheckInstance(checkId, value) {
    Actions.uncheckAll('sharedInstances');
    Actions.checkItem(checkId, value, 'name', 'myInstances');
  },

  initDialogs() {
    const {isLoading} = this.props;

    return [{
      dialog: Dialog.Delete,
      params: {
        key: 'deleteInstanceDialog',
        ref: 'deleteInstanceDialog',
        title: 'Delete an Instance',
        handleConfirm: Actions.removeInstances,
        items: Store.getCheckedItems('myInstances'),
        groupName: 'Instance',
        isLoading
      }
    }];
  },

  renderItem(item) {
    return (
      <ListItem
        key={`instances-list-item-${item.name}`}
        onIconClick={this.handleCheckInstance}
        item={item}
        showDeleteDialog={() => this.showDialog('deleteInstanceDialog', item)}/>
    );
  },

  render() {
    const checkedItems = Store.getNumberOfChecked('myInstances');

    return (
      <Loading show={this.props.isLoading}>
        <Lists.Container className='instances-list'>
          {this.getDialogs()}
          <ColumnList.Header>
            <Column.ColumnHeader
              primary={true}
              columnName="CHECK_ICON">
              {this.props.name}
            </Column.ColumnHeader>
            <Column.ColumnHeader columnName="DESC">Description</Column.ColumnHeader>
            <Column.ColumnHeader columnName="DATE">Created</Column.ColumnHeader>
            <Column.ColumnHeader columnName="MENU">
              <Lists.Menu
                checkedItemsCount={checkedItems}
                handleSelectAll={() => Actions.selectAll('myInstances')}
                handleUnselectAll={() => Actions.uncheckAll('myInstances')}>
                <Lists.MenuItem onTouchTap={() => this.showDialog('deleteInstanceDialog')} />
              </Lists.Menu>
            </Column.ColumnHeader>
          </ColumnList.Header>
          <Lists.List
            {...this.props}
            key="instances-list"
            renderItem={this.renderItem}/>
        </Lists.Container>
      </Loading>
    );
  }
});
