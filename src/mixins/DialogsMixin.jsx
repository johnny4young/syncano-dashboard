import React from 'react';
import _ from 'lodash';

export default {
  getDialogs() {
    let dialogs = this.initDialogs();

    return dialogs.map((dialog) => React.createElement(dialog.dialog, dialog.params));
  },

  removeEventFromArray() {
    let newArray = _.dropRight(arguments);

    return !_.isEmpty(newArray) ? newArray : null;
  },

  showDialog(ref, ...args) {
    this.refs[ref].show(this.removeEventFromArray(...args));
  },

  getDialogListLength(items) {
    return items.length;
  },

  getDialogList(items, paramName, associationFor) {
    let listItems = items.map((item) => {
      let isAssociated = (item.triggers && item.triggers.length > 0) || (item.schedules && item.schedules.length > 0);
      let triggersAssociation = item.triggers ? ` (${item.triggers.join(', ')})` : '';
      let schedulesAssociation = item.schedules ? ` (${item.schedules.join(', ')})` : '';
      let association = '';

      if (isAssociated && associationFor === 'triggers') {
        association = triggersAssociation;
      }

      if (isAssociated && associationFor === 'schedules') {
        association = schedulesAssociation;
      }

      return <li key={item[paramName || 'name']}>{item[paramName || 'name'] + association}</li>;
    });

    return <ul>{listItems}</ul>;
  },

  hideDialogs(hideDialogsFlag) {
    if (hideDialogsFlag) {
      return this.initDialogs().map((dialogConf) => {
        if (this.refs[dialogConf.params.ref]) {
          this.refs[dialogConf.params.ref].dismiss();
        }
      });
    }
  },

  getInitialState() {
    return {
      open: false
    };
  },

  componentWillUpdate(nextProps, nextState) {
    console.debug('DialogMixin::componentWillUpdate');

    if (this.state._dialogVisible === nextState._dialogVisible) {
      return true;
    }

    if (!nextState._dialogVisible) {
      return this.handleCancel();
    }

    if (!this.state._dialogVisible && nextState._dialogVisible) {
      if (_.isFunction(this.handleDialogShow)) {
        this.handleDialogShow();
      }

      this.show();
    }
  },

  resetDialogState() {
    if (_.isFunction(this.getInitialState)) {
      this.replaceState(this.getInitialState());
    }
  },

  handleCancel(dialogRef) {
    console.debug('DialogMixin::handleCancel');

    let ref = _.isString(dialogRef) ? this.refs[dialogRef] : this.refs.dialog;

    this.dismiss();

    if (!ref.props.avoidResetState) {
      this.resetDialogState();
    }
  },

  handleSuccessfullValidation() {
    console.debug('DialogMixin::handleSuccessfullValidation');

    if (this.hasEditMode()) {
      if (_.isFunction(this.handleEditSubmit)) {
        this.handleEditSubmit();
      }
    } else if (_.isFunction(this.handleAddSubmit)) {
      this.handleAddSubmit();
    }
  },

  hasEditMode() {
    return this.state._dialogMode === 'edit';
  },

  hasAddMode() {
    return this.state._dialogMode === 'add';
  },

  show() {
    this.setState({open: true});
  },

  dismiss() {
    this.setState({open: false});
  }
};

