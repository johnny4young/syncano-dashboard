var React = require('react');


module.exports = React.createClass({

  displayName: 'ColName',

  propTypes: {
    id: React.PropTypes.string,
    color: React.PropTypes.string.isRequired,
    hoverColor: React.PropTypes.string.isRequired,
    handleClick: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      color: '#999',
      hoverColor: '#0091EA',
    };
  },

  getInitialState: function () {
    return {
      color: this.props.color,
      hoverColor: this.props.hoverColor,
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

    return (
      <div
        style={{color: this.state.color}}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseLeave}
        onClick={this.handleClick}>
        <div style={{fontSize: '16px'}}>{this.props.children}</div>
      </div>
    )
  }
});