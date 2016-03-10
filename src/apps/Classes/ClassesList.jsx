import React from 'react';
import Router from 'react-router';
import _ from 'lodash';

// Utils
import {DialogsMixin} from '../../mixins';

// Stores and Actions
import Actions from './ClassesActions';
import Store from './ClassesStore';

import ListItem from './ClassesListItem';
import {ColumnList, Loading} from 'syncano-components';
import {Dialog, Lists} from '../../common';

let Column = ColumnList.Column;

export default React.createClass({
  displayName: 'ClassesList',

  mixins: [
    Router.State,
    Router.Navigation,
    DialogsMixin
  ],

  componentWillUpdate(nextProps) {
    console.info('ApiKeysList::componentWillUpdate');
    this.hideDialogs(nextProps.hideDialogs);
  },

  getAssociatedClasses() {
    let checkedClasses = Store.getCheckedItems();

    let associatedClasses = _.filter(checkedClasses, (checkedClass) => {
      checkedClass.triggers = _.pluck(_.filter(this.props.triggers, 'class', checkedClass.name), 'label');
      return checkedClass.triggers.length > 0;
    });

    return associatedClasses;
  },

  getAssociationsList(associationsFor, associatedItems) {
    let hasItems = associatedItems.length > 0;
    let list = {
      triggers: null,
      notAssociated: null
    };

    if (hasItems) {
      list.triggers = (
        <div>
          Associated with Triggers: {this.getDialogList(associatedItems, 'name', associationsFor)}
        </div>
      );
      list.notAssociated = (
        <div>
          Not associated: {this.getDialogList(associatedItems, 'name')}
        </div>
      );
    }

    return list[associationsFor];
  },

  isProtectedFromDelete(item) {
    return item.protectedFromDelete;
  },

  initDialogs() {
    let checkedClasses = Store.getCheckedItems();
    let classesAssociatedWithTriggers = this.getAssociatedClasses();
    let classesNotAssociated = _.difference(checkedClasses, classesAssociatedWithTriggers);
    let deleteDialog = {
      dialog: Dialog.Delete,
      params: {
        key: 'deleteClassDialog',
        ref: 'deleteClassDialog',
        title: 'Delete a Class',
        handleConfirm: Actions.removeClasses,
        isLoading: this.props.isLoading,
        items: Store.getCheckedItems(),
        groupName: 'Class'
      }
    };

    if (classesAssociatedWithTriggers) {
      let associatedWithTriggersList = this.getAssociationsList('triggers', classesAssociatedWithTriggers);
      let notAssociatedList = this.getAssociationsList('notAssociated', classesNotAssociated);

      deleteDialog.params.children = (
        <div>
          {`Some of checked Classes are associated with Triggers. Do you really want to delete
          ${Store.getDeleteItemsPhrase('Class')}?`}
          {notAssociatedList}
          {associatedWithTriggersList}
          <Loading
            type="linear"
            position="bottom"
            show={this.props.isLoading}/>
        </div>
      );
    }

    return [deleteDialog];
  },

  renderItem(item) {
    return (
      <ListItem
        key={`classes-list-item-${item.name}`}
        onIconClick={Actions.checkItem}
        item={item}
        showDeleteDialog={() => this.showDialog('deleteClassDialog', item)}/>
    );
  },

  render() {
    const checkedItems = Store.getCheckedItems();
    const checkedItemsCount = Store.getNumberOfChecked();
    const someClassIsProtectedFromDelete = checkedItems.some(this.isProtectedFromDelete);

    return (
      <Lists.Container className="classes-list">
        {this.getDialogs()}
        <ColumnList.Header>
          <Column.ColumnHeader
            primary={true}
            columnName="CHECK_ICON">
            {this.props.name}
          </Column.ColumnHeader>
          <Column.ColumnHeader
            columnName="DESC"
            className="col-flex-1">
            Objects
          </Column.ColumnHeader>
          <Column.ColumnHeader
            columnName="ID"
            className="col-flex-1">
            Group ID
          </Column.ColumnHeader>
          <Column.ColumnHeader
            columnName="DESC"
            className="col-flex-1">
            Permissions
          </Column.ColumnHeader>
          <Column.ColumnHeader columnName="DATE">Created</Column.ColumnHeader>
          <Column.ColumnHeader columnName="MENU">
            <Lists.Menu
              checkedItemsCount={checkedItemsCount}
              actions={Actions}>
              <Lists.MenuItem
                singleItemText="Delete a Class"
                multipleItemsText="Delete Classes"
                disabled={someClassIsProtectedFromDelete}
                onTouchTap={() => this.showDialog('deleteClassDialog')}/>
            </Lists.Menu>
          </Column.ColumnHeader>
        </ColumnList.Header>
        <Lists.List
          {...this.props}
          key="classes-list"
          renderItem={this.renderItem}/>
      </Lists.Container>
    );
  }
});

