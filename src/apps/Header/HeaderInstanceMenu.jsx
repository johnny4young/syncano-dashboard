import React from 'react';
import Router from 'react-router';

import MUI from 'syncano-material-ui';
import MenuItem from 'syncano-material-ui/lib/menus/menu-item';

export default React.createClass({

  displayName: 'HeaderInstanceMenu',

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  mixins: [
    Router.Navigation,
    Router.State
  ],

  getStyles() {
    return {
      color: '#fff',
      fill: '#fff'
    };
  },

  handleApiKeysClick() {
    this.transitionTo('api-keys', {instanceName: this.context.router.getCurrentParams().instanceName});
  },

  handleAdminsClick() {
    this.transitionTo('admins', {instanceName: this.context.router.getCurrentParams().instanceName});
  },

  renderMenuIcon() {
    let styles = this.getStyles();

    return (
      <MUI.IconButton
        iconStyle={styles}
        iconClassName="synicon-cog"/>
    );
  },

  render() {
    return (
      <MUI.IconMenu iconButtonElement={this.renderMenuIcon()}>
        <MenuItem onClick={this.handleAdminsClick}>Admins</MenuItem>
        <MenuItem onClick={this.handleApiKeysClick}>API Keys</MenuItem>
      </MUI.IconMenu>
    );
  }
});