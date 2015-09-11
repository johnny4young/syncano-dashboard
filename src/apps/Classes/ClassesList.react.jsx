import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';

// Utils
import HeaderMixin from '../Header/HeaderMixin';

// Stores and Actions
import SessionStore from '../Session/SessionStore';
import ClassesActions from './ClassesActions';
import ClassesStore from './ClassesStore';

import Common from '../../common';

let Column = Common.ColumnList.Column;

export default React.createClass({

  displayName: 'ClassesList',

  mixins: [
    Reflux.connect(ClassesStore),
    HeaderMixin,
    Router.State,
    Router.Navigation
  ],

  // List
  handleItemIconClick(id, state) {
    ClassesActions.checkItem(id, state);
  },

  handleItemClick(className) {
    SessionStore.getRouter().transitionTo(
      'classes-data-objects',
      {
        instanceName: SessionStore.getInstance().name,
        className
      }
    );
    console.info('ClassesList::handleItemClick');
  },

  renderItem(item) {
    let objectsCount = item.objects_count < 1000 ? item.objects_count : `~ ${item.objects_count}`;

    return (
      <Common.ColumnList.Item
        key={item.name}
        id={item.name}
        checked={item.checked}
        handleClick={this.handleItemClick.bind(null, item.name)}>
        <Column.CheckIcon
          id={item.name.toString()}
          icon={item.metadata ? item.metadata.icon : 'table-large'}
          background={Common.Color.getColorByName(item.metadata ? item.metadata.color : 'blue', 'xlight')}
          checked={item.checked}
          handleIconClick={this.handleItemIconClick}>
          {item.name}
        </Column.CheckIcon>
        <Column.Desc>{item.description}</Column.Desc>
        <Column.ID className="col-xs-3 col-md-3">{item.group}</Column.ID>
        <Column.Desc className="col-xs-6 col-md-6">
          <div>
            <div>group: {item.group_permissions}</div>
            <div>other: {item.other_permissions}</div>
          </div>
        </Column.Desc>
        <Column.ID className="col-xs-4 col-md-4">
          {objectsCount}
        </Column.ID>
        <Column.Date date={item.created_at}/>
      </Common.ColumnList.Item>
    )
  },

  renderList() {
    let items = this.state.items.map((item) => this.renderItem(item));

    if (items.length > 0) {
      items.reverse();
      return items;
    }
    return (
      <Common.ColumnList.EmptyItem handleClick={this.props.emptyItemHandleClick}>
        {this.props.emptyItemContent}
      </Common.ColumnList.EmptyItem>
    )
  },

  render() {
    return (
      <Common.Lists.Container className="classes-list-container">
        <Common.ColumnList.Header>
          <Column.ColumnHeader
            primary={true}
            columnName="CHECK_ICON">
            {this.props.name}
          </Column.ColumnHeader>
          <Column.ColumnHeader columnName="DESC">Description</Column.ColumnHeader>
          <Column.ColumnHeader
            columnName="ID"
            className="col-xs-3 col-md-3">
            Group
          </Column.ColumnHeader>
          <Column.ColumnHeader
            columnName="DESC"
            className="col-xs-6">
            Permissions
          </Column.ColumnHeader>
          <Column.ColumnHeader
            columnName="ID"
            className="col-xs-4 col-md-4">
            Objects
          </Column.ColumnHeader>
          <Column.ColumnHeader columnName="DATE">Created</Column.ColumnHeader>
        </Common.ColumnList.Header>
        <Common.Lists.List>
          <Common.Loading show={this.state.isLoading}>
            {this.renderList()}
          </Common.Loading>
        </Common.Lists.List>
      </Common.Lists.Container>
    );
  }
});

