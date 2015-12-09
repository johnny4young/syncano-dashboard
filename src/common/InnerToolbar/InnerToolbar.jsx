import React from 'react';
import {History} from 'react-router';

import {Store as SessionStore} from '../../apps/Session';
import {Toolbar, ToolbarGroup, ToolbarTitle, IconButton} from 'syncano-material-ui';

export default React.createClass({

  displayName: 'InnerToolbar',

  propTypes: {
    children: React.PropTypes.node
  },

  getDefaultProps() {
    return {
      backButtonTooltipPosition: 'bottom-right',
      forceBackFallback: false
    };
  },

  getStyles() {
    return {
      toolbar: {
        position: 'fixed',
        top: 50,
        right: 0,
        paddingLeft: 256,
        background: 'rgba(243,243,243,0.90)',
        padding: '0px 24px 0 24px',
        zIndex: 6
      },
      toolbarRight: {
        paddingTop: 4
      },
      title: {
        paddingLeft: 36
      }
    };
  },

  isHistory() {
    return History.length > 1;
  },

  handleBackButtonTouchTap() {
    if (this.isHistory() && !this.props.forceBackFallback) {
      return SessionStore.getRouter().goBack();
    }

    return this.props.backFallback();
  },

  renderBackButton() {
    if (this.isHistory() || this.props.backFallback) {
      return (
        <ToolbarGroup>
          <IconButton
            iconClassName="synicon-arrow-left"
            tooltip={this.props.backButtonTooltip}
            tooltipPosition={this.props.backButtonTooltipPosition}
            onClick={this.handleBackButtonTouchTap}
            touch={true}
            style={{marginTop: 4}}
            iconStyle={{color: 'rgba(0,0,0,.4)'}}/>
        </ToolbarGroup>
      );
    }

    return null;
  },

  renderTitle() {
    const styles = this.getStyles();

    if (this.props.title) {
      return (
        <ToolbarGroup style={styles.title}>
          <ToolbarTitle text={this.props.title}/>
        </ToolbarGroup>
      );
    }

    return null;
  },

  renderChildren() {
    const styles = this.getStyles();

    if (this.props.children) {
      return (
        <ToolbarGroup float="right" style={styles.toolbarRight}>
          {this.props.children}
        </ToolbarGroup>
      );
    }

    return null;
  },

  render() {
    const styles = this.getStyles();

    return (
      <Toolbar style={styles.toolbar}>
        {this.renderBackButton()}
        {this.renderTitle()}
        {this.renderChildren()}
      </Toolbar>
    );
  }
});
