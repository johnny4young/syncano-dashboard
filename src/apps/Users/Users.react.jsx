var React                 = require('react'),
    Reflux                = require('reflux'),
    Router                = require('react-router'),

    // Utils
    HeaderMixin           = require('../Header/HeaderMixin'),
    ButtonActionMixin     = require('../../mixins/ButtonActionMixin'),
    InstanceTabsMixin     = require('../../mixins/InstanceTabsMixin'),
    DialogsMixin          = require('../../mixins/DialogsMixin'),
    Show                  = require('../../common/Show/Show.react'),

    UsersActions          = require('./UsersActions'),
    UsersStore            = require('./UsersStore'),
    GroupsActions         = require('./GroupsActions'),
    GroupsStore           = require('./GroupsStore'),

    // Components
    mui                   = require('material-ui'),
    Dialog                = mui.Dialog,
    Container             = require('../../common/Container/Container.react'),
    FabList               = require('../../common/Fab/FabList.react'),
    FabListItem           = require('../../common/Fab/FabListItem.react'),
    ColorIconPickerDialog = require('../../common/ColorIconPicker/ColorIconPickerDialog.react'),
    Loading               = require('../../common/Loading/Loading.react.jsx'),

    // Local components
    UsersList             = require('./UsersList.react'),
    GroupsList            = require('./GroupsList.react'),
    UserDialog            = require('./UserDialog.react'),
    GroupDialog           = require('./GroupDialog.react');

module.exports = React.createClass({

  displayName: 'Users',

  mixins: [
    Router.State,
    Router.Navigation,

    Reflux.connect(UsersStore, 'users'),
    Reflux.connect(GroupsStore, 'groups'),
    HeaderMixin,
    InstanceTabsMixin,
    DialogsMixin
  ],

  componentWillUpdate: function(nextProps, nextState) {
    console.info('Users::componentWillUpdate');
    this.hideDialogs(nextState.users.hideDialogs || nextState.groups.hideDialogs);
  },

  componentDidMount: function() {
    console.info('Users::componentDidMount');
    UsersActions.fetch();
    GroupsActions.fetch();
  },

  handleRemoveGroups: function() {
    console.info('Users::handleDelete');
    GroupsActions.removeGroups(GroupsStore.getCheckedItems());
  },

  handleRemoveUsers: function() {
    console.info('Users::handleRemoveUsers');
    UsersActions.removeUsers(UsersStore.getCheckedItems());
  },

  uncheckAllUsers: function() {
    console.info('Users::uncheckAllUsers');
    UsersActions.uncheckAll();
  },

  uncheckAllGroups: function() {
    console.info('Users::uncheckAllGroups');
    GroupsActions.uncheckAll();
  },

  selectAllUsers: function() {
    console.info('Users::selectAllUsers');
    UsersActions.selectAll();
  },

  selectAllGroups: function() {
    console.info('Users::selectAllGroups');
    GroupsActions.selectAll();
  },

  checkUser: function(id, state) {
    console.info('User::checkUser');
    GroupsActions.uncheckAll();
    UsersActions.checkItem(id, state);
  },

  checkGroup: function(id, state) {
    console.info('User::checkGroup');
    UsersActions.uncheckAll();
    GroupsActions.checkItem(id, state);
  },

  showUserDialog: function() {
    UsersActions.showDialog();
  },

  showUserEditDialog: function() {
    UsersActions.showDialog(UsersStore.getCheckedItem());
  },

  showGroupDialog: function() {
    GroupsActions.showDialog();
  },

  showGroupEditDialog: function() {
    GroupsActions.showDialog(GroupsStore.getCheckedItem());
  },

  initDialogs: function() {
    var checkedGroups = GroupsStore.getCheckedItems(),
        checkedUsers  = UsersStore.getCheckedItems();

    return [
      // Groups
      {
        dialog: Dialog,
        params: {
          ref:    'removeGroupDialog',
          title:  'Delete Group',
          actions: [
            {
              text    : 'Cancel',
              onClick : this.handleCancel
            },
            {
              text    : 'Yes, I\'m sure',
              onClick : this.handleRemoveGroups}
          ],
          modal: true,
          children: [
            'Do you really want to delete ' + this.getDialogListLength(checkedGroups)  + ' Group(s)?',
            this.getDialogList(checkedGroups, 'label'),
            <Loading
              type     = 'linear'
              position = 'bottom'
              show     = {this.state.groups.isLoading} />
          ]
        }
      },

      // Users
      {
        dialog: Dialog,
        params: {
          ref:    'removeUserDialog',
          title:  'Delete User',
          actions: [
            {text: 'Cancel', onClick: this.handleCancel},
            {text: 'Yes, I\'m sure', onClick: this.handleRemoveUsers}
          ],
          modal: true,
          children: [
            'Do you really want to delete ' + this.getDialogListLength(checkedUsers) + ' User(s)?',
            this.getDialogList(checkedUsers, 'username'),
            <Loading
              type     = 'linear'
              position = 'bottom'
              show     = {this.state.users.isLoading} />
          ]
        }
      }
    ]
  },

  render: function() {
    var checkedUsers       = UsersStore.getNumberOfChecked(),
        checkedGroups      = GroupsStore.getNumberOfChecked(),
        isAnyUserSelected  = checkedUsers >= 1 && checkedUsers < (this.state.users.items.length),
        isAnyGroupSelected = checkedGroups >= 1 && checkedGroups < (this.state.groups.items.length);

    return (
      <Container>
        {this.getDialogs()}
        <UserDialog />
        <GroupDialog />

        <Show if={checkedUsers > 0}>
          <FabList position="top">

            <FabListItem
              label         = {isAnyUserSelected ? "Click here to select all" : "Click here to unselect all"}
              mini          = {true}
              onClick       = {isAnyUserSelected ? this.selectAllUsers : this.uncheckAllUsers}
              iconClassName = {isAnyUserSelected ? "synicon-checkbox-multiple-marked-outline" : "synicon-checkbox-multiple-blank-outline"} />

            <FabListItem
              label         = "Click here to delete Users"
              mini          = {true}
              onClick       = {this.showDialog('removeUserDialog')}
              iconClassName = "synicon-delete" />

            <FabListItem
              label         = "Click here to edit User"
              mini          = {true}
              disabled      = {checkedUsers > 1}
              onClick       = {this.showUserEditDialog}
              iconClassName = "synicon-pencil" />

          </FabList>
        </Show>

        <Show if={checkedGroups > 0}>
          <FabList position="top">

            <FabListItem
              label         = {isAnyGroupSelected ? "Click here to select all" : "Click here to unselect all"}
              mini          = {true}
              onClick       = {isAnyGroupSelected ? this.selectAllGroups : this.uncheckAllGroups}
              iconClassName = {isAnyGroupSelected ? "synicon-checkbox-multiple-marked-outline" : "synicon-checkbox-multiple-blank-outline"} />

            <FabListItem
              label         = "Click here to delete Users"
              mini          = {true}
              onClick       = {this.showDialog('removeGroupDialog')}
              iconClassName = "synicon-delete" />

            <FabListItem
              label         = "Click here to edit Group"
              mini          = {true}
              disabled      = {checkedUsers > 1}
              onClick       = {this.showGroupEditDialog}
              iconClassName = "synicon-pencil" />

          </FabList>
        </Show>

        <FabList>

          <FabListItem
            label         = "Click here to create User account"
            onClick       = {this.showUserDialog}
            iconClassName = "synicon-account-plus" />

          <FabListItem
            label         = "Click here to create Group"
            onClick       = {this.showGroupDialog}
            iconClassName = "synicon-account-multiple-plus" />

        </FabList>

        <div className="row">

          <div className="col-lg-8">
            <GroupsList
              name                 = "Groups"
              checkItem            = {this.checkGroup}
              isLoading            = {this.state.groups.isLoading}
              items                = {this.state.groups.items}
              emptyItemHandleClick = {this.showGroupDialog}
              emptyItemContent     = "Create a Group" />

          </div>

          <div className="col-flex-1">
            <UsersList
              name                 = "Users"
              checkItem            = {this.checkUser}
              isLoading            = {this.state.users.isLoading}
              items                = {this.state.users.items}
              emptyItemHandleClick = {this.showUserDialog}
              emptyItemContent     = "Create a User" />
          </div>

        </div>

      </Container>
    );
  }

});
