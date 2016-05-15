import React from 'react';
import {Styles, Utils} from 'syncano-material-ui';
import SocketWrapper from './SocketWrapper';

export default React.createClass({
  displayName: 'ChannelSocket',

  getDefaultProps() {
    return {
      tooltipPosition: 'bottom-left',
      iconClassName: 'synicon-plus-circle-outline'
    };
  },

  getStyles() {
    return {
      iconStyle: {
        color: Styles.Colors.blue400
      }
    };
  },

  render() {
    const styles = this.getStyles();
    const {
      style,
      iconStyle,
      iconClassName,
      ...other
      } = this.props;

    return (
      <SocketWrapper
        {...other}
        iconClassName={iconClassName}
        style={style}
        iconStyle={Utils.Styles.mergeStyles(styles.iconStyle, iconStyle)}/>
    );
  }
});
