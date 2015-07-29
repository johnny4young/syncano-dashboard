import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';

// Utils
import Mixins from '../../mixins';
import HeaderMixin from '../Header/HeaderMixin';

// Stores and Actions
import SessionActions from '../Session/SessionActions';
import SessionStore from '../Session/SessionStore';
import DataViewsActions from './DataViewsActions';
import DataViewsStore from './DataViewsStore';
import WebhooksActions from './WebhooksActions';
import WebhooksStore from './WebhooksStore';

// Components
import MUI from 'material-ui';
import Common from '../../common';
import Container from '../../common/Container/Container.react';

// Local components
import DataViewsList from './DataViewsList.react';
import WebhooksList from './WebhooksList.react';
import DataViewDialog from './DataViewDialog.react';
import WebhookDialog from './WebhookDialog.react';

export default React.createClass({

  displayName: 'Data',

  mixins: [
    Router.State,
    Router.Navigation,

    Reflux.connect(DataViewsStore, 'dataviews'),
    Reflux.connect(WebhooksStore, 'webhooks'),
    Mixins.Dialogs,
    Mixins.InstanceTabs,
    HeaderMixin
  ],

  fetch() {
    DataViewsActions.fetch();
    WebhooksActions.fetch();
  },

  componentDidMount() {
    console.info('Data::componentDidMount');
    this.fetch();
  },

  componentWillReceiveProps() {
    console.info('Data::componentWillReceiveProps');
    this.fetch();
  },

  componentWillUpdate(nextProps, nextState) {
    console.info('Data::componentWillUpdate');
    this.hideDialogs(nextState.dataviews.hideDialogs || nextState.webhooks.hideDialogs);
  },

  // Dialogs config
  initDialogs() {

    return [
      {
        dialog: Common.Dialog,
        params: {
          key   : 'removeWebhookDialog',
          ref   : 'removeWebhookDialog',
          title : 'Delete Webhook',
          actions: [
            {
              text    : 'Cancel',
              onClick : this.handleCancel},
            {
              text    : 'Yes, I\'m sure',
              onClick : this.handleRemoveWebhooks}
          ],
          modal    : true,
          children : 'Do you really want to delete ' + WebhooksStore.getCheckedItems().length + ' webhooks?'
        }
      },
      {
        dialog: Common.Dialog,
        params: {
          key:    'removeDataViewDialog',
          ref:    'removeDataViewDialog',
          title:  'Delete DataView',
          actions: [
            {
              text    : 'Cancel',
              onClick : this.handleCancel
            },
            {
              text    : 'Yes, I\'m sure',
              onClick : this.handleRemoveDataViews
            }
          ],
          modal    : true,
          children : 'Do you really want to delete ' + DataViewsStore.getCheckedItems().length + ' Data endpoints?'
        }
      }
    ]
  },

  handleRemoveWebhooks() {
    console.info('Data::handleDelete');
    WebhooksActions.removeWebhooks(WebhooksStore.getCheckedItems());
  },

  handleRemoveDataViews() {
    console.info('Data::handleRemoveDataViews');
    DataViewsActions.removeDataViews(DataViewsStore.getCheckedItems());
  },

  uncheckAll() {
    console.info('Data::uncheckAll');
    DataViewsActions.uncheckAll();
    WebhooksActions.uncheckAll();
  },

  showDataViewDialog() {
    DataViewsActions.showDialog();
  },

  showDataViewEditDialog() {
    DataViewsActions.showDialog(DataViewsStore.getCheckedItem());
  },

  showWebhookDialog() {
    WebhooksActions.showDialog();
  },

  showWebhookEditDialog() {
    WebhooksActions.showDialog(WebhooksStore.getCheckedItem());
  },

  render() {
    let checkedDataViews = DataViewsStore.getNumberOfChecked(),
        checkedWebhooks  = WebhooksStore.getNumberOfChecked();

    return (
      <Container>
        <WebhookDialog />
        <DataViewDialog />
        {this.getDialogs()}

        <Common.Show if={checkedDataViews > 0}>
          <Common.Fab position="top">
            <Common.Fab.Item
              label         = "Click here to unselect all"
              mini          = {true}
              onClick       = {this.uncheckAll}
              iconClassName = "synicon-checkbox-multiple-marked-outline" />
            <Common.Fab.Item
              label         = "Click here to delete Data Endpoint"
              mini          = {true}
              onClick       = {this.showDialog.bind(null, 'removeDataViewDialog')}
              iconClassName = "synicon-delete" />
            <Common.Fab.Item
              label         = "Click here to edit Data Endpoint"
              mini          = {true}
              disabled      = {checkedDataViews > 1}
              onClick       = {this.showDataViewEditDialog}
              iconClassName = "synicon-pencil" />
          </Common.Fab>
        </Common.Show>

        <Common.Show if={checkedWebhooks > 0}>
          <Common.Fab position="top">
            <Common.Fab.Item
              label         = "Click here to unselect all"
              mini          = {true}
              onClick       = {this.uncheckAll}
              iconClassName = "synicon-checkbox-multiple-marked-outline" />
            <Common.Fab.Item
              label         = "Click here to delete CodeBox Endpoint"
              mini          = {true}
              onClick       = {this.showDialog.bind(null, 'removeWebhookDialog')}
              iconClassName = "synicon-delete" />
            <Common.Fab.Item
              label         = "Click here to edit CodeBox Endpoint"
              mini          = {true}
              disabled      = {checkedDataViews > 1}
              onClick       = {this.showWebhookEditDialog}
              iconClassName = "synicon-pencil" />
          </Common.Fab>
        </Common.Show>

        <Common.Fab>
          <Common.Fab.Item
            label         = "Click here to create Data Endpoint"
            onClick       = {this.showDataViewDialog}
            iconClassName = "synicon-table" />
          <Common.Fab.Item
            label         = "Click here to create CodeBox Endpoint"
            onClick       = {this.showWebhookDialog}
            iconClassName = "synicon-arrow-up-bold" />
        </Common.Fab>

        <DataViewsList
          name                 = "Data Endpoints"
          checkItem            = {DataViewsActions.checkItem}
          isLoading            = {this.state.dataviews.isLoading}
          items                = {this.state.dataviews.items}
          emptyItemHandleClick = {this.showDataViewDialog}
          emptyItemContent     = "Create a DataView" />

        <WebhooksList
          name                 = "CodeBox Endpoints"
          checkItem            = {WebhooksActions.checkItem}
          isLoading            = {this.state.webhooks.isLoading}
          items                = {this.state.webhooks.items}
          emptyItemHandleClick = {this.showWebhookDialog}
          emptyItemContent     = "Create a Webhook" />
      </Container>
    );
  }
});
