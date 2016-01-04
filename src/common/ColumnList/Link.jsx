import React from 'react';

import Clipboard from '../Clipboard/Clipboard';
import {FontIcon, Tooltip} from 'syncano-material-ui';

export default React.createClass({

  displayName: 'ColumnListLink',

  getInitialState() {
    return {
      tooltipShown: false
    };
  },

  getDefaultProps() {
    return {
      snackbar: 'URL copied to the clipboard'
    };
  },

  getStyles() {
    return {
      root: {
        position: 'relative',
        cursor: 'pointer'
      },
      name: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      },
      linkContainer: {
        display: 'flex',
        flexWrap: 'wrap'
      },
      link: {
        fontSize: '0.8em',
        color: '#9B9B9B',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingRight: 20,
        position: 'relative',
        whiteSpace: 'nowrap'
      },
      icon: {
        position: 'absolute',
        top: 2,
        right: 0,
        fontSize: 15,
        verticalAlign: 'middle',
        color: '#9B9B9B'
      },
      tooltip: {
        pointerEvents: 'none'
      }
    };
  },

  showTooltip() {
    this.setState({tooltipShown: true});
  },

  hideTooltip() {
    this.setState({tooltipShown: false});
  },


  render() {
    let styles = this.getStyles();
    let link = SYNCANO_BASE_URL.slice(0, -1) + this.props.link;

    return (
      <div
        onMouseLeave={this.hideTooltip}
        onMouseEnter={this.showTooltip}
        style={styles.root}>
        <Clipboard
          copyText={link}
          snackbarText={this.props.snackbar}>
          <div style={styles.name}>{this.props.name}</div>
          <div style={styles.linkContainer}>
            <div style={styles.link}>
              {this.props.link}
              <FontIcon
                style={styles.icon}
                className="synicon-link-variant"/>
            </div>
          </div>
        </Clipboard>
        <Tooltip
          style={styles.tooltip}
          label={this.props.tooltip}
          show={this.state.tooltipShown}
          verticalPosition="bottom"
          horizontalPosition="right"/>
      </div>
    );
  }
});