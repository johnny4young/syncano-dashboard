var React            = require('react'),
    Reflux           = require('reflux'),

    // Utils
    ValidationMixin  = require('../../mixins/ValidationMixin'),
    FormMixin        = require('../../mixins/FormMixin'),

    // Stores and Actions
    UsersActions     = require('./UsersActions'),
    UserDialogStore  = require('./UserDialogStore'),
    CodeBoxesStore   = require('../CodeBoxes/CodeBoxesStore'),

    // Components
    mui              = require('material-ui'),
    Toggle           = mui.Toggle,
    TextField        = mui.TextField,
    DropDownMenu     = mui.DropDownMenu,
    Dialog           = mui.Dialog;


module.exports = React.createClass({

  displayName: 'UserDialog',

  mixins: [
    React.addons.LinkedStateMixin,
    Reflux.connect(UserDialogStore),
    ValidationMixin,
    FormMixin
  ],

  validatorConstraints: {
    username: {
      presence: true
    },
    password: {
      presence: true
    }
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.visible === false) {
      this.refs.dialog.dismiss();
    } else if (nextState.visible === true) {
      this.refs.dialog.show();
    }
  },

  handleCancel: function () {
    this.refs.dialog.dismiss();

    if (typeof this.getInitialState === 'function') {
      this.setState(this.getInitialState());
    }
  },

  hasInstance: function () {
    if (this.state.instance === undefined) {
      return false;
    }

    if (typeof this.state.instance !== 'object') {
      return false;
    }

    if (Object.keys(this.state.instance).length === 0) {
      return false;
    }

    return true;
  },

  handleSuccessfullValidation: function () {
    console.log(this.hasInstance(), 'this.hasInstance()', this.state.instance);
    if (this.hasInstance()) {
      this.handleEditSubmit();
    } else {
      this.handleAddSubmit();
    }
  },

  handleAddSubmit: function () {
    UsersActions.createUser({
      username : this.state.username,
      password : this.state.password
    });
  },

  handleEditSubmit: function () {
    UsersActions.updateUser(this.state.instance.id, {
      username : this.state.username,
      password : this.state.password
    });
  },

  render: function () {
    var title       = this.hasInstance() ? 'Edit': 'Add',
        submitLabel = 'Confirm';

        dialogStandardActions = [
          {
            ref     : 'cancel',
            text    : 'Cancel',
            onClick : this.handleCancel
          },
          {
            ref     : 'submit',
            text    : {submitLabel},
            onClick : this.handleFormValidation
          }
        ];

    return (
      <Dialog
        ref       = "dialog"
        title     = {title + " User"}
        actions   = {dialogStandardActions}
        modal     = {true}>
        <div>
          {this.renderFormNotifications()}
          <form
            onSubmit      = {this.handleFormValidation}
            acceptCharset = "UTF-8"
            method        = "post">

            <TextField
              ref               = "username"
              name              = "username"
              style             = {{width:'100%'}}
              valueLink         = {this.linkState('username')}
              errorText         = {this.getValidationMessages('username').join(' ')}
              hintText          = "Username"
              floatingLabelText = "Username" />

            <TextField
              ref               = "password"
              name              = "password"
              type              = "password"
              style             = {{width:'100%'}}
              valueLink         = {this.linkState('password')}
              errorText         = {this.getValidationMessages('password').join(' ')}
              hintText          = "User password"
              floatingLabelText = "Password" />

          </form>
        </div>
      </Dialog>
    );
  }

});
