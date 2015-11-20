import React from 'react';
import Reflux from 'reflux';

// Utils
import Mixins from '../../mixins';

// Stores and Actions
import ChannelsStore from './ChannelsStore';
import ChannelsActions from './ChannelsActions';
import ChannelDialogStore from './ChannelDialogStore';

// Components
import MUI from 'syncano-material-ui';
import Common from '../../common';

export default React.createClass({

  displayName: 'ChannelDialog',

  mixins: [
    Reflux.connect(ChannelDialogStore),
    Mixins.Dialog,
    Mixins.Form
  ],

  validatorConstraints: {
    name: {
      presence: true
    },
    type: {
      presence: true
    }
  },

  getParams() {
    return {
      name: this.state.name,
      description: this.state.description,
      type: this.state.type,
      group: this.state.group,
      custom_publish: this.state.custom_publish,
      other_permissions: this.state.other_permissions,
      group_permissions: this.state.group_permissions
    };
  },

  handleEditSubmit() {
    ChannelsActions.updateChannel(this.state.name, this.getParams());
  },

  handleAddSubmit() {
    ChannelsActions.createChannel(this.getParams());
  },

  handleToogle(event, status) {
    let state = {};

    state[event.target.name] = status;
    this.setState(state);
  },

  render() {
    let title = this.hasEditMode() ? 'Edit' : 'Create';
    let dialogStandardActions = [
      <MUI.FlatButton
        key="cancel"
        label="Cancel"
        onTouchTap={this.handleCancel}
        ref="cancel"/>,
      <MUI.FlatButton
        type="submit"
        key="confirm"
        label="Confirm"
        primary={true}
        ref="submit"/>
    ];

    return (
      <form
        onSubmit={this.handleFormValidation}
        method="post"
        acceptCharset="UTF-8">
        <Common.Dialog
          ref='dialog'
          title={title + ' a Channel'}
          actions={dialogStandardActions}
          contentStyle={{padding: '8px 0 0 0'}}>
          <div>
            {this.renderFormNotifications()}

            <div className="row">
              <div className="col-md-12">
                <MUI.TextField
                  ref='name'
                  valueLink={this.linkState('name')}
                  errorText={this.getValidationMessages('name').join(' ')}
                  name='name'
                  disabled={this.hasEditMode()}
                  fullWidth={true}
                  hintText='Short name for your Channel'
                  floatingLabelText='Name of a Channel' />
              </div>
              <div className="col-flex-1">
                <MUI.TextField
                  ref='description'
                  name='description'
                  valueLink={this.linkState('description')}
                  errorText={this.getValidationMessages('description').join(' ')}
                  fullWidth={true}
                  hintText='Description of a Channel (optional)'
                  floatingLabelText='Description of a Channel' />
              </div>
            </div>
            <Common.SelectField
              ref='type'
              name='type'
              floatingLabelText='Channel type'
              valueLink={this.linkState('type')}
              errorText={this.getValidationMessages('type').join(' ')}
              valueMember='payload'
              displayMember='text'
              disabled={this.hasEditMode()}
              fullWidth={true}
              menuItems={ChannelsStore.getChannelTypesDropdown()} />

            <div style={{marginTop: 40}}>Permissions</div>
            <div className="row">
              <div className="col-flex-1">
                <MUI.TextField
                  ref='group'
                  name='group'
                  fullWidth={true}
                  valueLink={this.linkState('group')}
                  errorText={this.getValidationMessages('group').join(' ')}
                  hintText='ID of the Group'
                  floatingLabelText='Group (ID)' />
              </div>
              <div className="col-flex-1">
                <MUI.SelectField
                  ref='group_permissions'
                  name='group_permissions'
                  floatingLabelText='Group permissions'
                  valueLink={this.linkState('group_permissions')}
                  errorText={this.getValidationMessages('group_permissions').join(' ')}
                  valueMember='payload'
                  displayMember='text'
                  fullWidth={true}
                  menuItems={ChannelsStore.getChannelPermissionsDropdown()} />
              </div>
              <div className="col-flex-1">
                <MUI.SelectField
                  ref='other_permissions'
                  name='other_permissions'
                  floatingLabelText='Other permissions'
                  valueLink={this.linkState('other_permissions')}
                  errorText={this.getValidationMessages('other_permissions').join(' ')}
                  valueMember='payload'
                  displayMember='text'
                  fullWidth={true}
                  menuItems={ChannelsStore.getChannelPermissionsDropdown()} />
              </div>
            </div>
            <MUI.Toggle
              ref='custom_publish'
              name='custom_publish'
              defaultToggled={this.state.custom_publish}
              onToggle={this.handleToogle}
              style={{marginTop: 20}}
              label='Custom publishing in this channel?' />
          </div>
          <Common.Loading
            type='linear'
            position='bottom'
            show={this.state.isLoading} />
        </Common.Dialog>
      </form>
    );
  }
});
