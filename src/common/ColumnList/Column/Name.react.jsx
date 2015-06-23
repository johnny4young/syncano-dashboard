var React       = require('react'),
    Radium      = require('radium'),

    mui         = require('material-ui'),
    Paper       = mui.Paper,
    Colors      = mui.Styles.Colors;


var defaultClassName = 'col-xs-8';

var Header = React.createClass({
  getDefaultProps: function () {
    return {
      className : defaultClassName
    }
  },

  getStyles: function () {
    return {
      fontSize    : 20,
      fontWeight  : 500
    }
  },

  render: function () {
    var styles = this.getStyles();

    return (
      <div
        className = {this.props.className}
        style     = {styles}>
        {this.props.children}
      </div>
    )
  }
});

module.exports = Radium(React.createClass({

  displayName: 'ColumnName',

  propTypes: {
    id: React.PropTypes.string,
    color: React.PropTypes.string.isRequired,
    hoverColor: React.PropTypes.string.isRequired,
    handleClick: React.PropTypes.func
  },

  statics :{
    Header: Header
  },

  getDefaultProps: function() {
    return {
      color      : 'rgba(0,0,0,.54)',
      hoverColor : Colors.blue600,
      className  : defaultClassName
    };
  },

  getInitialState: function () {
    return {
      color: this.props.color,
      hoverColor: this.props.hoverColor
    }
  },

  getStyles: function () {
    return {
      display         : 'flex',
      flexDirection   : 'row',
      fontSize        : 12,
      paddingTop      : 16,
      paddingBottom   : 16,
      alignSelf       : 'center',
      cursor          : 'pointer',
      color           : this.state.color
    }
  },

  handleMouseOver: function () {
    this.setState({'color': this.props.hoverColor})
  },

  handleMouseLeave: function () {
    this.setState({'color': this.props.color})
  },

  handleClick: function () {
    this.props.handleClick(this.props.id);
  },

  render: function () {
    var styles = this.getStyles();

    return (
      <div
        className   = {this.props.className}
        style       = {styles}
        onMouseOver = {this.handleMouseOver}
        onMouseOut  = {this.handleMouseLeave}>
        {this.props.children}
      </div>
    );

  }
}));
