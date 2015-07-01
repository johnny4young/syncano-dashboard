var React             = require('react'),
    Reflux            = require('reflux'),
    Router            = require('react-router'),

    // Utils
    HeaderMixin       = require('../Header/HeaderMixin'),
    ButtonActionMixin = require('../../mixins/ButtonActionMixin'),

    // Stores and Actions
    SessionActions    = require('../Session/SessionActions'),
    SchedulesActions  = require('./SchedulesActions'),
    SchedulesStore    = require('./SchedulesStore'),
    CodeBoxesStore    = require('../CodeBoxes/CodeBoxesStore'),

    // Components
    mui               = require('material-ui'),
    Colors            = require('material-ui/lib/styles/colors'),
    FontIcon          = mui.FontIcon,

    // List
    ListContainer     = require('../../common/Lists/ListContainer.react'),
    List              = require('../../common/Lists/List.react'),
    Item              = require('../../common/ColumnList/Item.react'),
    EmptyListItem     = require('../../common/ColumnList/EmptyListItem.react'),
    Header            = require('../../common/ColumnList/Header.react'),
    Loading           = require('../../common/Loading/Loading.react'),
    ColumnDate        = require('../../common/ColumnList/Column/Date.react'),
    ColumnID          = require('../../common/ColumnList/Column/ID.react'),
    ColumnDesc        = require('../../common/ColumnList/Column/Desc.react'),
    ColumnKey         = require('../../common/ColumnList/Column/Key.react'),
    ColumnCheckIcon   = require('../../common/ColumnList/Column/CheckIcon.react');


module.exports = React.createClass({

  displayName: 'SchedulesList',

  mixins: [
    HeaderMixin,
    Router.State,
    Router.Navigation
  ],

  getInitialState() {
    return {
      items     : this.props.items,
      isLoading : this.props.isLoading
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      items     : nextProps.items,
      isLoading : nextProps.isLoading
    })
  },

  // List
  handleItemIconClick: function (id, state) {
    this.props.checkItem(id, state);
  },

  renderItem: function (item) {
    // TODO: move to store
    var codeBox      = CodeBoxesStore.getCodeBoxById(item.codebox),
        codeBoxLabel = codeBox ? codeBox.label: '';

    return (
      <Item
        checked = {item.checked}
        key     = {item.id}>
        <ColumnCheckIcon
          id              = {item.id.toString()}
          icon            = 'camera-timer'
          background      = {Colors.blue500}
          checked         = {item.checked}
          handleIconClick = {this.handleItemIconClick} >
          {item.label}
        </ColumnCheckIcon>
        <ColumnID>{item.id}</ColumnID>
        <ColumnDesc className="col-xs-8">{codeBoxLabel}</ColumnDesc>
        <ColumnDesc>{item.crontab}</ColumnDesc>
        <ColumnDate>{item.scheduled_next}</ColumnDate>
        <ColumnDate>{item.created_at}</ColumnDate>
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
      <EmptyListItem handleClick={this.props.emptyItemHandleClick}>
        {this.props.emptyItemContent}
      </EmptyListItem>
    )
  },

  render: function () {
    return (
      <ListContainer>
        <Header>
          <ColumnCheckIcon.Header>{this.props.name}</ColumnCheckIcon.Header>
          <ColumnID.Header>ID</ColumnID.Header>
          <ColumnDesc.Header className="col-xs-8">CodeBox</ColumnDesc.Header>
          <ColumnDesc.Header>Crontab</ColumnDesc.Header>
          <ColumnDate.Header>Next run</ColumnDate.Header>
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

