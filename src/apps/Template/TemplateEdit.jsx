import React from 'react';
import Reflux from 'reflux';
import {Navigation, State} from 'react-router';

// Utils
import {
  DialogsMixin,
  InstanceTabsMixin,
  FormMixin,
  MousetrapMixin,
  SnackbarNotificationMixin
} from '../../mixins';
import HeaderMixin from '../Header/HeaderMixin';
import UnsavedDataMixin from './UnsavedDataMixin';
import AutosaveMixin from './TemplateAutosaveMixin';
import TemplateConstants from './TemplateConstants';

// Stores and Actions
import Actions from './TemplateActions';
import Store from './TemplateStore';

// Components
import {FlatButton, Styles, Checkbox} from 'syncano-material-ui';
import {Show, CharacterCounter, Loading} from 'syncano-components';
import {Dialog, Editor, Notification} from '../../common';

export default React.createClass({
  displayName: 'TemplateEdit',

  mixins: [
    State,
    Navigation,

    Reflux.connect(Store),
    DialogsMixin,
    InstanceTabsMixin,
    MousetrapMixin,
    FormMixin,
    HeaderMixin,
    UnsavedDataMixin,
    AutosaveMixin,
    SnackbarNotificationMixin
  ],

  autosaveAttributeName: 'templateContentAutosave',

  componentDidMount() {
    Actions.fetch();
    this.bindShortcut(['command+s', 'ctrl+s'], () => {
      this.handleUpdate();
      return false;
    });
  },

  getStyles() {
    return {
      contextPanel: {
        marginTop: 30,
        height: 300
      },
      durationSummary: {
        marginTop: 8
      },
      autosaveCheckbox: {
        marginTop: 30
      },
      statusSummaryFailed: {
        color: Styles.Colors.red400
      },
      statusSummarySuccess: {
        color: Styles.Colors.green400
      },
      notification: {
        marginTop: 20
      }
    };
  },

  isSaved() {
    if (this.state.template && this.refs.editorContent) {
      let content = this.state.template.content;
      let currentContent = this.refs.editorContent.editor.getValue();

      return content === currentContent;
    }
  },

  handleUpdate() {
    this.clearAutosaveTimer();

    Actions.updateTemplate(this.state.template.name, {
      content: this.refs.editorContent.editor.getValue()
    });

    this.setSnackbarNotification({
      message: 'Saving...'
    });
  },

  handleOnSourceChange() {
    this.resetForm();
    this.runAutoSave();
  },

  initDialogs() {
    return [{
      dialog: Dialog,
      params: {
        key: 'unsavedDataWarn',
        ref: 'unsavedDataWarn',
        title: 'Unsaved Snippet source',
        actions: [
          <FlatButton
            label="Just leave"
            secondary={true}
            onTouchTap={this._handleContinueTransition}/>,
          <FlatButton
            label="Continue editing"
            primary={true}
            keyboardFocused={true}
            onTouchTap={() => this.handleCancel('unsavedDataWarn')}/>
        ],
        avoidResetState: true,
        modal: true,
        children: "You're leaving Snippet Editor with unsaved changes. Are you sure you want to continue?"
      }
    }];
  },

  render() {
    let styles = this.getStyles();
    let charactersCount = this.refs.editorContent ? this.refs.editorContent.editor.getValue().length : 0;

    return (
      <div>
        {this.getDialogs()}
        <Loading show={this.state.isLoading}>
          <div>
            <Editor
              ref="editorContent"
              mode="text"
              theme="tomorrow"
              onChange={this.handleOnSourceChange}
              onLoad={this.clearAutosaveTimer}
              value={this.state.template.content}/>
            <CharacterCounter
              charactersCountWarn={TemplateConstants.charactersCountWarn}
              characters={charactersCount}
              maxCharacters={TemplateConstants.maxCharactersCount}/>
            <Show if={this.getValidationMessages('content').length > 0}>
              <div style={styles.notification}>
                <Notification type="error">
                  {this.getValidationMessages('content').join(' ')}
                </Notification>
              </div>
            </Show>
            <Checkbox
              ref="autosaveCheckbox"
              name="autosaveCheckbox"
              label="Autosave"
              style={styles.autosaveCheckbox}
              defaultChecked={this.isAutosaveEnabled()}
              onCheck={this.saveCheckboxState}/>


            <div style={styles.contextPanel}>
              <Editor.Panel
                ref="contextPanel"
                onError={Actions.setPayloadValidator}
                handleChange={Actions.setPayloadValue}
                trace={this.state.renderedTemplate}
                payloadValue={this.state.template.context}
                floatingLabelText="Context"
                hintText='Type in your context here e.g. {"object": {}}'
                loading={this.state.isRendering}/>
            </div>

          </div>
        </Loading>
      </div>
    );
  }
});
