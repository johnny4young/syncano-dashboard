import React from 'react';

import Toolbar from 'material-ui/lib/toolbar/toolbar';

export default React.createClass({

  displayName: 'InnerToolbar',

  propTypes: {
    children: React.PropTypes.node
  },

  getStyles() {
    return {
      position: 'fixed',
      top: 64,
      right: 0,
      paddingLeft: 256,
      background: 'rgba(215,215,215,0.6)',
      padding: '0px 32px 0 24px',
      zIndex: 6
    }
  },

  render() {
    const styles = this.getStyles();

    return (
      <Toolbar style={styles}>
        {this.props.children}
      </Toolbar>
    );
  }
});