import React from 'react';
import Reflux from 'reflux';

import {DialogMixin, FormMixin} from '../../../mixins';

import Actions from './PartialBackupsActions';
import Store from './PartialBackupsDialogStore';

import {TextField} from 'material-ui';
import {colors as Colors} from 'material-ui/styles';
import {Dialog, Editor, Notification, Show} from '../../../common';

export default React.createClass({
  displayName: 'CreatePartialBackupDialog',

  mixins: [
    Reflux.connect(Store),
    DialogMixin,
    FormMixin
  ],

  validatorConstraints: {
    label: {
      presence: true,
      length: {
        minimum: 5,
        maximum: 64
      }
    },
    description: {
      length: {
        maximum: 256
      }
    },
    queryArgs: (value) => {
      try {
        JSON.parse(value);
      } catch (e) {
        return {
          inclusion: {
            within: [],
            message: 'is not a valid JSON'
          }
        };
      }
      return null;
    }
  },

  getStyles() {
    return {
      queryArgsLabel: {
        color: '#AAA',
        fontSize: 10,
        fontWeight: 800,
        margin: '20px 0 10px 0'
      },
      link: {
        fontWeight: 'bold',
        textDecoration: 'underline',
        color: Colors.blue400
      }
    };
  },

  handleChange(value, key) {
    this.setState({
      [key]: value
    });
  },

  handleAddSubmit() {
    const {label, description, queryArgs} = this.state;

    Actions.createPartialBackup({label, description, query_args: JSON.parse(queryArgs)});
  },

  render() {
    const {isLoading, open, label, description, queryArgs} = this.state;
    const styles = this.getStyles();

    return (
      <Dialog.FullPage
        key="dialog"
        ref="dialog"
        contentSize="medium"
        title="Create Instance Partial Backup"
        onRequestClose={this.handleCancel}
        open={open}
        isLoading={isLoading}
        bindShortcuts={false}
        actions={
          <Dialog.StandardButtons
            disabled={isLoading}
            handleCancel={this.handleCancel}
            handleConfirm={this.handleFormValidation}/>
        }
        sidebar={
          <Dialog.SidebarBox>
            <Dialog.SidebarSection>
              Partial backups allow you to export some of your Instance data
              (Classes, Scripts, Data Objects, Users) and files into an archive,
              which you can download for later use.
            </Dialog.SidebarSection>
            <Dialog.SidebarSection title="Query Args">
              {`Query Args is a JSON object where keys are what type of objects you want to include in
              your backup. Values are arrays of IDs or names of objects that you want to include
              in backup file. If you don't pass a key in the query args, all objects will be saved.`}
            </Dialog.SidebarSection>
            <Dialog.SidebarSection last={true}>
              <Dialog.SidebarLink to="http://docs.syncano.io/v1.1/docs/partial-backups">
                Learn more
              </Dialog.SidebarLink>
            </Dialog.SidebarSection>
          </Dialog.SidebarBox>
        }>
        <div>
          <TextField
            autoFocus={true}
            fullWidth={true}
            value={label}
            onChange={(event, value) => this.handleChange(value, 'label')}
            errorText={this.getValidationMessages('label').join(' ')}
            hintText="Backup's label"
            floatingLabelText="Label" />
          <TextField
            fullWidth={true}
            value={description}
            onChange={(event, value) => this.handleChange(value, 'description')}
            errorText={this.getValidationMessages('description').join(' ')}
            hintText="Backup's description"
            floatingLabelText="Description" />
          <div className="vm-3-t">
            <div style={styles.queryArgsLabel}>QUERY ARGS</div>
            <Editor
              name="queryArgsEditor"
              ref="queryArgsEditor"
              mode="json"
              height="400px"
              onChange={(value) => this.handleChange(value, 'queryArgs')}
              value={queryArgs || ['{', '  ', '}'].join('\n')}/>
          </div>
          <div className="vm-2-t">
            {this.renderFormNotifications()}
            <Show if={this.getValidationMessages('queryArgs').length}>
              <Notification type="error">
                {this.getValidationMessages('queryArgs').join(' ')}
              </Notification>
            </Show>
          </div>
        </div>
      </Dialog.FullPage>
    );
  }
});
