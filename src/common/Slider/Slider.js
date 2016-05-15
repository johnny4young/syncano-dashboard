import React from 'react';
import Radium from 'radium';
import {Styles, Slider} from 'syncano-material-ui';

export default Radium(React.createClass({
  displayName: 'Slider',

  propTypes: {
    legendItems: React.PropTypes.array,
    defaultSliderValue: React.PropTypes.number
  },

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      defaultSliderValue: 0
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  },

  getStyles() {
    return {
      container: {
        position: 'relative'
      },
      legendItems: {
        position: 'absolute',
        minWidth: '100px',
        textAlign: 'center',
        transform: 'translateX(-50%)',
        userSelect: 'none',
        cursor: 'pointer'
      },
      lastLegendItem: {
        Transform: 'translate(-100%) !important',
        textAlign: 'right !important'
      },
      selectedItem: {
        color: Styles.Colors.lightBlueA700
      }
    };
  },

  handleOptionsClick(i, type) {
    this.props.optionClick(i, type);
  },

  handleChange(event, value) {
    this.props.onChange(this.props.type, event, value);
  },

  renderLegendItems() {
    let styles = this.getStyles();

    return this.props.legendItems.map(function(item, i) {
      let position = i / (this.props.legendItems.length - 1) * 100 + '%';
      let isLastItem = false;
      let isSelected = i === this.state.value;

      return (
        <div
          key={i}
          style={[
            styles.legendItems,
            {left: position},
            isLastItem && styles.lastLegendItem,
            isSelected && styles.selectedItem
          ]}
          onClick={this.handleOptionsClick.bind(this, i, this.props.type)}
          >
          {item}
        </div>
      );
    }.bind(this));
  },

  renderLegend() {
    let styles = this.getStyles().container;

    return (
      <div style={styles}>
        {this.renderLegendItems()}
      </div>
    );
  },

  render() {
    return (
      <div>
        <Slider
          style={{margin: '0 auto'}}
          name='slider'
          ref='slider'
          step={1}
          min={0}
          max={this.props.legendItems.length - 1}
          defaultValue={this.props.defaultSliderValue}
          onChange={this.handleChange}
          value={this.state.value}/>
        {this.renderLegend()}
      </div>
    );
  }
}));
