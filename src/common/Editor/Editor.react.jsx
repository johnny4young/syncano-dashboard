// Port from react-ace

import React from 'react';
import ace from 'brace';

import 'brace/mode/python';
import 'brace/mode/javascript';
import 'brace/mode/ruby';
import 'brace/mode/golang';
import 'brace/theme/tomorrow';


export default React.createClass({

  propTypes: {
    mode: React.PropTypes.oneOf(['python', 'javascript', 'ruby', 'golang']),
    theme: React.PropTypes.string,
    name: React.PropTypes.string,
    height: React.PropTypes.string,
    width: React.PropTypes.string,
    fontSize: React.PropTypes.number,
    showGutter: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    value: React.PropTypes.string,
    onLoad: React.PropTypes.func,
    maxLines: React.PropTypes.number,
    readOnly: React.PropTypes.bool,
    highlightActiveLine: React.PropTypes.bool,
    showPrintMargin: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      name: 'brace-editor',
      mode: '',
      theme: '',
      height: '500px',
      width: '100%',
      value: '',
      fontSize: 12,
      showGutter: true,
      onChange: null,
      onLoad: null,
      maxLines: null,
      readOnly: false,
      highlightActiveLine: true,
      showPrintMargin: true
    };
  },

  componentDidMount() {
    this.editor = ace.edit(this.props.name);
    this.editor.$blockScrolling = Infinity;
    this.editor.getSession().setMode('ace/mode/' + this.props.mode);
    this.editor.setTheme('ace/theme/' + this.props.theme);
    this.editor.setFontSize(this.props.fontSize);
    this.editor.on('change', this.onChange);
    this.editor.setValue(this.props.value);
    this.editor.renderer.setShowGutter(this.props.showGutter);
    this.editor.setOption('maxLines', this.props.maxLines);
    this.editor.setOption('readOnly', this.props.readOnly);
    this.editor.setOption('highlightActiveLine', this.props.highlightActiveLine);
    this.editor.setShowPrintMargin(this.props.setShowPrintMargin);

    this.editor.clearSelection();

    if (this.props.onLoad) {
      this.props.onLoad(this.editor);
    }
  },

  componentWillReceiveProps(nextProps) {
    this.editor = ace.edit(nextProps.name);
    this.editor.getSession().setMode('ace/mode/' + nextProps.mode);
    this.editor.setTheme('ace/theme/' + nextProps.theme);
    this.editor.setFontSize(nextProps.fontSize);
    this.editor.setOption('maxLines', nextProps.maxLines);
    this.editor.setOption('readOnly', nextProps.readOnly);
    this.editor.setOption('highlightActiveLine', nextProps.highlightActiveLine);
    this.editor.setShowPrintMargin(nextProps.setShowPrintMargin);

    if (this.editor.getValue() !== nextProps.value) {
      this.editor.setValue(nextProps.value);
    }
    this.editor.renderer.setShowGutter(nextProps.showGutter);
    if (nextProps.onLoad) {
      nextProps.onLoad(this.editor);
    }

    this.editor.clearSelection();
  },

  onChange() {
    let value = this.editor.getValue();

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  },

  render() {
    let divStyle = {
      width: this.props.width,
      height: this.props.height
    };

    return (<div id={this.props.name} onChange={this.onChange} style={divStyle}></div>);
  }
});
