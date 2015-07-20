var React             = require('react'),
    Reflux            = require('reflux'),
    Router            = require('react-router'),

    // Utils
    HeaderMixin       = require('../Header/HeaderMixin'),
    ButtonActionMixin = require('../../mixins/ButtonActionMixin'),

    // Stores and Actions
    SessionActions   = require('../Session/SessionActions'),
    ApiKeysActions   = require('./ApiKeysActions'),
    ApiKeysStore     = require('./ApiKeysStore'),

    // Components
    mui              = require('material-ui'),
    Colors           = require('material-ui/lib/styles/colors'),
    FontIcon         = mui.FontIcon,

    // List
    ListContainer    = require('../../common/Lists/ListContainer.react'),
    List             = require('../../common/Lists/List.react'),
    Item             = require('../../common/ColumnList/Item.react'),
    EmptyListItem    = require('../../common/ColumnList/EmptyListItem.react'),
    Header           = require('../../common/ColumnList/Header.react'),
    Loading          = require('../../common/Loading/Loading.react'),
    ColumnDate       = require('../../common/ColumnList/Column/Date.react'),
    ColumnID         = require('../../common/ColumnList/Column/ID.react'),
    ColumnText       = require('../../common/ColumnList/Column/Text.react'),
    ColumnKey        = require('../../common/ColumnList/Column/Key.react'),
    ColumnCheckIcon  = require('../../common/ColumnList/Column/CheckIcon.react');


module.exports = React.createClass({

  displayName: 'ApiKeysList',

  mixins: [
    Reflux.connect(ApiKeysStore),
    HeaderMixin,
    Router.State,
    Router.Navigation
  ],

  handleItemIconClick: function (id, state) {
    ApiKeysActions.checkItem(id, state);
  },

  renderItem: function (item) {

    var ignore_acl = null,
        allow_user_create = null;

    if (item.ignore_acl) {
      ignore_acl = <div>Ignore ACL</div>;
    }
    if (item.allow_user_create) {
      allow_user_create = <div>Allow user creation</div>;
    }

    return (
      <Item
        checked = {item.checked}
        key     = {item.id}>
        <ColumnCheckIcon
          id              = {item.id.toString()}
          icon            = 'key'
          background      = {Colors.blue500}
          checked         = {item.checked}
          handleIconClick = {this.handleItemIconClick} >
          {item.description}
        </ColumnCheckIcon>
        <ColumnID>{item.id}</ColumnID>
        <ColumnKey color="black">{item.api_key}</ColumnKey>
        <ColumnText>
          {ignore_acl}
          {allow_user_create}
        </ColumnText>
        <ColumnDate date={item.created_at} />
      </Item>
    )
  },

  getList: function () {
    var items = this.state.items.map(function (item) {
      return this.renderItem(item)
    }.bind(this));

    if (items.length > 0) {
      // TODO: Fix this dirty hack, that should be done in store by sorting!
      items.reverse();
      return items;
    }
    return (
      <EmptyListItem
        handleClick={this.props.emptyItemHandleClick}>
        {this.props.emptyItemContent}
      </EmptyListItem>
    );
  },

  render: function () {
    return (
      <ListContainer>
        <Header>
          <ColumnCheckIcon.Header>{this.props.name}</ColumnCheckIcon.Header>
          <ColumnID.Header>ID</ColumnID.Header>
          <ColumnKey.Header>Key</ColumnKey.Header>
          <ColumnText.Header>Permissions</ColumnText.Header>
          <ColumnDate.Header>Created</ColumnDate.Header>
        </Header>
        <List>
          <Loading show={this.state.isLoading}>
            {this.getList()}
          </Loading>
        </List>
      </ListContainer>
    );
  }
});

