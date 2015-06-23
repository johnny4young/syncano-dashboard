var React       = require('react'),
    Radium      = require('radium'),

    mui         = require('material-ui'),
    Paper       = mui.Paper,
    Colors      = mui.Styles.Colors;


// Move it later to some theme? Constants?
var DEFAULT_BACKGROUND = 'green',
    DEFAULT_ICON       = 'folder';

var defaultClassName = 'col-xs-10';

var Header = React.createClass({

  getDefaultProps: function () {
    return {
      className : defaultClassName
    }
  },

  getStyles: function () {
    return {
      fontSize    : 20,
      fontWeight  : 500,
      paddingLeft : 16
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

  displayName: 'ColumnCheckIcon',

  propTypes: {
    id              : React.PropTypes.string,
    color           : React.PropTypes.string,
    hoverColor      : React.PropTypes.string,
    handleIconClick : React.PropTypes.func,
    handleNameClick : React.PropTypes.func
  },

  statics :{
    Header: Header
  },

  getDefaultProps: function () {
    return {
      color      : 'black',
      hoverColor : Colors.blue600,
      className  : defaultClassName
    }
  },

  getInitialState: function () {
    return {
      checked    : this.props.checked
    }
  },

  getStyles: function() {
    return {
      container: {
        display         : 'flex',
        flexDirection   : 'row',
        alignItems      : 'center',
        fontSize        : 12,
        padding         : '16px 8px'
      },
      name: {
        fontSize        : 16,
        lineHeight      : '20px',
        display         : 'flex',
        flexDirection   : 'column',
        justifyContent  : 'center',
        cursor          : 'pointer',
        color           : this.state.color
      },
      icon : {
        margin          : 12,
        height          : 50,
        width           : 50,
        display         : 'flex',
        justifyContent  : 'center',
        alignItems      : 'center',
        background      : this.props.background
      }
    };
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({checked: newProps.checked});
  },

  handleIconClick: function (id, state) {
    console.info('ColumnCheckIcon:handleClick');
    this.props.handleIconClick(id, state);
  },

  handleNameClick: function() {
    console.info('ColumnCheckIcon:handleClick');
    this.props.handleNameClick(this.props.id);
  },

  handleMouseOver: function () {
    console.info('ColumnCheckIcon::handleMouseOver');
    this.setState({'color': this.props.hoverColor});
  },

  handleMouseLeave: function () {
    console.info('ColumnCheckIcon::handleMouseLeave');
    this.setState({'color': this.props.color});
  },

  render: function () {
    var styles = this.getStyles();

    return (
      <div
        className = {this.props.className}
        style     = {styles.container}>

        <Paper
          circle = {true}
          style  = {styles.icon} />

        <div
          style       = {styles.name}
          onClick     = {this.handleNameClick}
          onMouseOver = {this.handleMouseOver}
          onMouseOut  = {this.handleMouseLeave}>
          {this.props.children}
        </div>
      </div>
    );
  }
}));
