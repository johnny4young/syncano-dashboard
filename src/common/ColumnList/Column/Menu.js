import React from 'react';
import Radium from 'radium';
import ColumnListConstans from '../ColumnListConstans';
import { IconButton, IconMenu } from 'material-ui';
import { colors as Colors } from 'material-ui/styles/';

export default Radium(React.createClass({
  displayName: 'ColumnDesc',

  propTypes: {
    color: React.PropTypes.string.isRequired,
    hoverColor: React.PropTypes.string.isRequired
  },

  getDefaultProps() {
    return {
      color: 'rgba(0,0,0,.54)',
      hoverColor: Colors.blue600,
      className: ColumnListConstans.DEFAULT_CLASSNAME.MENU
    };
  },

  getInitialState() {
    return {
      color: this.props.color,
      hoverColor: this.props.hoverColor
    };
  },

  getStyles() {
    return {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      fontSize: 13,
      lineHeight: '16px',
      wordBreak: 'break-all',
      color: this.props.color
    };
  },

  handleTouchTap(event) {
    event.stopPropagation();
    if (this.props.handleClick) {
      this.props.handleClick();
    }
  },

  renderItemIconMenuButton() {
    return (
      <IconButton
        touch
        tooltipPosition="bottom-left"
        iconClassName="synicon-dots-vertical"
      />
    );
  },

  render() {
    let styles = this.getStyles();

    return (
      <div
        className={this.props.className}
        style={styles}
      >
        <IconMenu
          onTouchTap={this.handleTouchTap}
          iconButtonElement={this.renderItemIconMenuButton()}
          anchorOrigin={{ horizontal: 'middle', vertical: 'center' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          {this.props.children}
        </IconMenu>
      </div>
    );
  }
}));
