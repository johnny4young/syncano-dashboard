import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';

// Utils
import HeaderMixin from '../Header/HeaderMixin';

// Stores and Actions
import SessionActions from '../Session/SessionActions';
import CodeBoxesStore from '../CodeBoxes/CodeBoxesStore';
import Actions from './TriggersActions';
import Store from './TriggersStore';

// Components
import MUI from 'material-ui';
import Common from '../../common';

let Column = Common.ColumnList.Column;

export default React.createClass({

  displayName: 'TriggersList',

  mixins: [
    HeaderMixin,
    Router.State,
    Router.Navigation
  ],

  getInitialState() {
    return {
      items: this.props.items,
      isLoading: this.props.isLoading
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      items: nextProps.items,
      isLoading: nextProps.isLoading
    })
  },

  // List
  handleItemIconClick(id, state) {
    this.props.checkItem(id, state);
  },

  handleItemClick(itemId) {
    // Redirect to traces screen
    this.transitionTo('trigger-traces', {
      instanceName: this.getParams().instanceName,
      triggerId: itemId
    });
  },

  renderItem(item) {
    // TODO: move to store
    let codeBox = CodeBoxesStore.getCodeBoxById(item.codebox);
    let codeBoxLabel = codeBox ? codeBox.label : '';

    return (
      <Common.ColumnList.Item
        checked={item.checked}
        key={item.id}
        handleClick={this.handleItemClick.bind(null, item.id)}>
        <Column.CheckIcon
          id={item.id.toString()}
          icon='arrow-up-bold'
          background={Common.Color.getColorByName('blue', 'xlight')}
          checked={item.checked}
          handleIconClick={this.handleItemIconClick}>
          {item.label}
        </Column.CheckIcon>
        <Column.ID>{item.id}</Column.ID>
        <Column.Desc className="col-sm-6">{codeBoxLabel}</Column.Desc>
        <Column.Desc className="col-sm-6">{item.class}</Column.Desc>
        <Column.Desc>{item.signal}</Column.Desc>
        <Column.Date date={item.created_at}/>
      </Common.ColumnList.Item>
    )
  },

  getList() {
    let items = this.state.items.map(item => this.renderItem(item));

    if (items.length > 0) {
      // TODO: Fix this dirty hack, that should be done in store by sorting!
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
      <Common.Lists.Container>
        <Common.ColumnList.Header>
          <Column.CheckIcon.Header>{this.props.name}</Column.CheckIcon.Header>
          <Column.ID.Header>ID</Column.ID.Header>
          <Column.Desc.Header className="col-sm-6">CodeBox</Column.Desc.Header>
          <Column.Desc.Header className="col-sm-6">Class</Column.Desc.Header>
          <Column.Desc.Header>Signal</Column.Desc.Header>
          <Column.Date.Header>Created</Column.Date.Header>
        </Common.ColumnList.Header>
        <Common.Lists.List>
          <Common.Loading show={this.state.isLoading}>
            {this.getList()}
          </Common.Loading>
        </Common.Lists.List>
      </Common.Lists.Container>
    );
  }
});

