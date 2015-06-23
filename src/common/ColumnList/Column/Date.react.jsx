var React              = require('react'),
    Radium             = require('radium'),
    Moment             = require('moment'),
    ColumnListConstans = require('../ColumnListConstans'),

    mui                = require('material-ui'),
    Paper              = mui.Paper,
    Colors             = mui.Styles.Colors;


var Header = React.createClass({

  getDefaultProps: function () {
    return {
      className : ColumnListConstans.DEFAULT_CLASSNAME.DATE
    }
  },

  render: function () {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    )
  }
});

module.exports = Radium(React.createClass({

  displayName: 'ColumnDate',

  propTypes: {
    id          : React.PropTypes.string,
    color       : React.PropTypes.string.isRequired,
    handleClick : React.PropTypes.func
  },

  statics :{
    Header : Header
  },

  getDefaultProps: function() {
    return {
      color      : 'rgba(0,0,0,.54)',
      hoverColor : Colors.blue600,
      className  : ColumnListConstans.DEFAULT_CLASSNAME.DATE
    };
  },

  getInitialState: function () {
    return {
      color      : this.props.color,
      hoverColor : this.props.hoverColor
    }
  },

  getStyles: function() {
    return {
      display        : 'flex',
      flexDirection  : 'column',
      justifyContent : 'center',
      fontSize       : '12px',
      lineHeight     : '16px',
      paddingTop     : 16,
      paddingBottom  : 16,
      color          : this.props.color
    };
  },

  handleClick: function () {
    this.props.handleClick(this.props.id);
  },

  render: function () {
    var styles = this.getStyles();

    return (
      <div
        className = {this.props.className}
        style     = {styles}>
        <span>{Moment(this.props.children).format('DD/MM/YYYY')}</span>
        <span>{Moment(this.props.children).format('LTS')}</span>
      </div>
    );

  }
}));
