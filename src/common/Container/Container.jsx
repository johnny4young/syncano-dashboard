import React from 'react';
import {Utils} from 'syncano-material-ui';

export default React.createClass({

  displayName: 'Container',

  propTypes: {
    style: React.PropTypes.object
  },

  mixins: [Utils.Styles],

  getStyles() {
    let styles = {
      padding: '32px 24px 64px'
    };

    return this.mergeAndPrefix(styles, this.props.style);
  },

  render() {
    let styles = this.getStyles();

    return (
      <div
        id={this.props.id}
        style={styles}>
        {this.props.children}
      </div>
    );
  }
});
