import React from 'react';
import Router from 'react-router';

import {LeftNav} from '../mixins';

// Stores and Action
import SessionActions from '../apps/Session/SessionActions';

import MUI from 'material-ui';
import HeaderInstancesDropdown from '../apps/Header/HeaderInstancesDropdown.react';
import InstanceDialog from '../apps/Instances/InstanceDialog.react';

export default React.createClass({

  displayName: 'Instance',

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [
    LeftNav,
    Router.State,
    Router.Navigation
  ],

  componentWillMount() {
    console.debug('Instance::componentWillMount');
    const params = this.getParams();

    if (params.instanceName) {
      SessionActions.fetchInstance(params.instanceName);
    }
  },

  getStyles() {
    return {
      leftNav: {
        paddingTop: 64,
        zIndex: 7,
        overflow: 'visible'
      },
      menuItemStyleSubheader: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: 12,
        paddingTop: 4,
        fontWeight: 800
      },
      content: {
        margin: '96px 104px 48px 304px'
      },
      addInstanceItem: {
        fontSize: 14,
        display: 'flex; display: -ms-flexbox; display: -webkit-flex; display: flex;',
        alignItems: '-ms-flex-align: center; -webkit-align-items: center; align-items: center;'
      },
      plusIcon: {
        marginTop: '4px',
        color: 'rgba(0, 0, 0, 0.54)'
      }
    };
  },

  getMenuItems() {
    return [
      {
        type: MUI.MenuItem.Types.SUBHEADER,
        text: 'Modules'
      },
      {
        type: MUI.MenuItem.Types.LINK,
        route: 'webhooks',
        payload: this.getMenuItemHref('webhooks'),
        text: 'Webhooks'
      },
      {
        type: MUI.MenuItem.Types.LINK,
        route: 'classes',
        payload: this.getMenuItemHref('classes'),
        text: 'Classes'
      },
      {
        type: MUI.MenuItem.Types.LINK,
        route: 'codeboxes',
        payload: this.getMenuItemHref('codeboxes'),
        text: 'CodeBoxes'
      },
      {
        type: MUI.MenuItem.Types.LINK,
        route: 'users',
        payload: this.getMenuItemHref('users'),
        text: 'Users'
      },
      {
        type: MUI.MenuItem.Types.LINK,
        route: 'channels',
        payload: this.getMenuItemHref('channels'),
        text: 'Channels'
      },
      {
        type: MUI.MenuItem.Types.LINK,
        route: 'tasks',
        payload: this.getMenuItemHref('tasks'),
        text: 'Tasks'
      },
      {
        type: MUI.MenuItem.Types.SUBHEADER,
        text: 'Settings'
      },
      {
        type: MUI.MenuItem.Types.LINK,
        route: 'admins',
        payload: this.getMenuItemHref('admins'),
        text: 'Administrators'
      },
      {
        type: MUI.MenuItem.Types.LINK,
        route: 'api-keys',
        payload: this.getMenuItemHref('api-keys'),
        text: 'API keys'
      },
      {
        type: MUI.MenuItem.Types.LINK,
        route: 'instance-edit',
        payload: this.getMenuItemHref('instance-edit'),
        text: 'General'
      }
    ];
  },

  redirectToNewInstance() {
    let instanceName = this.refs.addInstanceDialog.refs.name.getValue();

    SessionActions.fetchInstance(instanceName);
    this.transitionTo('instance', {instanceName});
  },

  renderInstanceDropdown() {
    return (
    <div style={{paddingTop: 10, paddingBottom: 10, paddingLeft: 24}}>
      <HeaderInstancesDropdown/>
    </div>
    );
  },

  render() {
    const styles = this.getStyles();

    return (
    <div>
      <InstanceDialog
        ref="addInstanceDialog"
        handleSubmit={this.redirectToNewInstance}/>
      <MUI.LeftNav
        className="left-nav"
        ref="leftNav"
        header={this.renderInstanceDropdown()}
        menuItemStyleSubheader={styles.menuItemStyleSubheader}
        selectedIndex={this.getActiveTab(this.getMenuItems()).index}
        style={styles.leftNav}
        menuItems={this.getMenuItems()}/>
      <div style={styles.content}>
        <Router.RouteHandler />
      </div>
    </div>
    );
  }
});
