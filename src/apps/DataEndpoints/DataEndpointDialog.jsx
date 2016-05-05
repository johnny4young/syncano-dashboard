import React from 'react';
import Reflux from 'reflux';

// Utils
import {DialogMixin, FormMixin} from '../../mixins';

// Stores and Actions
import Actions from './DataEndpointsActions';
import Store from './DataEndpointDialogStore';
import ClassesActions from '../Classes/ClassesActions';
import ClassesStore from '../Classes/ClassesStore';

// Components
import {TextField, Toggle, Checkbox} from 'syncano-material-ui';
import {SelectFieldWrapper, Show} from 'syncano-components';
import {Dialog} from '../../common';

export default React.createClass({
  displayName: 'DataEndpointDialog',

  mixins: [
    Reflux.connect(Store),
    DialogMixin,
    FormMixin
  ],

  validatorConstraints: {
    name: {
      presence: true
    },
    class: {
      presence: true
    }
  },

  getDataEndpointParams() {
    const {name, description, order_by, page_size, excluded_fields, expand} = this.state;

    return {
      name,
      class: this.state.class,
      description,
      order_by,
      page_size,
      excluded_fields,
      expand
    };
  },

  isEnabled(list, field) {
    if (!list) {
      return false;
    }
    return list.replace(/ /g, '').split(',').indexOf(field) > -1;
  },

  handleDialogShow() {
    console.info('DataEndpointDialog::handleDialogShow');
    ClassesActions.fetch();
  },

  handleAddSubmit() {
    Actions.createDataEndpoint(this.getDataEndpointParams());
  },

  handleEditSubmit() {
    Actions.updateDataEndpoint(this.state.name, this.getDataEndpointParams());
  },

  handleToggle(fieldsType, fieldName, event, value) {
    console.info('DataEndpointDialog::handleToggle', arguments);
    const {expand, excluded_fields} = this.state;

    let genList = (list, name, val) => {
      let arr = list.replace(/ /g, '').split(',').filter((listItem) => listItem);

      if (val) {
        arr.push(name);
      } else {
        arr = arr.filter((arrItem) => arrItem !== name);
      }

      return arr.join(',');
    };

    let fields = '';

    if (fieldsType === 'showFields') {
      fields = genList(excluded_fields, fieldName, !value);
      this.setState({excluded_fields: fields});
    }
    if (fieldsType === 'expandFields') {
      fields = genList(expand, fieldName, value);
      this.setState({expand: fields});
    }
  },

  renderFields() {
    console.info('DataEndpointDialog::renderFields', this.state.class);

    let fields = [
      <div className="row vp-3-b">
        <div className="col-flex-1">Class Fields</div>
        <div className="col-xs-8">Expand</div>
      </div>
    ];

    if (this.state.class) {
      return fields.concat(ClassesStore.getClassFields(this.state.class).map((field) => {
        return (
          <div className="row">
            <div className="col-flex-1">
              <Toggle
                key={field.name}
                name={field.name}
                value={field.name}
                label={field.name}
                defaultToggled={!this.isEnabled(this.state.excluded_fields, field.name)}
                onToggle={this.handleToggle.bind(this, 'showFields', field.name)}
                />
            </div>
            <div className="col-xs-8">
              <Show if={field.type === 'reference'}>
                <Checkbox
                  name="expand"
                  defaultChecked={this.isEnabled(this.state.expand, field.name)}
                  disabled={this.isEnabled(this.state.excluded_fields, field.name)}
                  onCheck={this.handleToggle.bind(this, 'expandFields', field.name)}
                  />
              </Show>
            </div>
          </div>
        );
      }));
    }
  },

  renderOptions() {
    console.info('DataEndpointDialog::renderOrderBy', this.state.class);
    let orderField = <div key="options_header" style={{paddingTop: '24px'}}>Add schema fields with order index</div>;
    const orderFields = ClassesStore.getClassOrderFieldsPayload(this.state.class);

    if (orderFields.length > 0) {
      orderField = (
        <SelectFieldWrapper
          name="order_by"
          floatingLabelText="Order by"
          options={orderFields}
          value={this.state.order_by}
          onChange={(event, index, value) => this.setSelectFieldValue('order_by', value)}
          errorText={this.getValidationMessages('order_by').join(' ')}/>
      );
    }

    return [
      <div>Response options</div>,
      orderField,
      <TextField
        ref="page_size"
        name="page_size"
        fullWidth={true}
        valueLink={this.linkState('page_size')}
        errorText={this.getValidationMessages('page_size').join(' ')}
        hintText="Number"
        floatingLabelText="Number of records in data set"/>
    ];
  },

  render() {
    const title = this.hasEditMode() ? 'Edit' : 'Add';
    let fields = null;
    let options = null;

    if (this.state.class) {
      fields = this.renderFields();
      options = this.renderOptions();
    }

    return (
      <Dialog.FullPage
        key="dialog"
        ref="dialog"
        title={`${title} a Data Endpoint`}
        onRequestClose={this.handleCancel}
        open={this.state.open}
        isLoading={this.state.isLoading}
        actions={
          <Dialog.StandardButtons
            disabled={!this.state.canSubmit}
            handleCancel={this.handleCancel}
            handleConfirm={this.handleFormValidation}/>
        }
        sidebar={
          <Dialog.SidebarBox>
            <Dialog.SidebarSection>
              With Data Endpoints you can configure Data Object calls and save them for later use.
            </Dialog.SidebarSection>
            <Dialog.SidebarSection title="Class">
              Classes define properties of Data Objects. If you have no Classes yet you can create one&nbsp;
              <Dialog.SidebarLink to="classes">
                here.
              </Dialog.SidebarLink>
            </Dialog.SidebarSection>
            <Dialog.SidebarSection title="Class Fields">
              Choose which fields of Class schema will be included in the response. If a field is referencing
              Data Objects in a different Class, you can expand it to get those Data Objects proprerties.
            </Dialog.SidebarSection>
            <Dialog.SidebarSection last={true}>
              <Dialog.SidebarLink to="http://docs.syncano.io/docs/endpoints-data">
                Learn more
              </Dialog.SidebarLink>
            </Dialog.SidebarSection>
          </Dialog.SidebarBox>
        }>
        {this.renderFormNotifications()}
        <Dialog.ContentSection>
          <div className="col-xs-12">
            <TextField
              ref="name"
              name="name"
              autoFocus={true}
              fullWidth={true}
              disabled={this.hasEditMode()}
              valueLink={this.linkState('name')}
              errorText={this.getValidationMessages('name').join(' ')}
              hintText="Data Endpoint's name"
              floatingLabelText="Name"/>
          </div>
          <div className="col-flex-1" style={{paddingLeft: 15}}>
            <TextField
              ref="description"
              name="description"
              fullWidth={true}
              valueLink={this.linkState('description')}
              errorText={this.getValidationMessages('description').join(' ')}
              hintText="Data Endpoint's description"
              floatingLabelText="Description (optional)"/>
          </div>
        </Dialog.ContentSection>
        <Dialog.ContentSection>
          <div className="col-flex-1">
            <SelectFieldWrapper
              name="class"
              options={this.state.classes}
              value={this.state.class}
              onChange={(event, index, value) => this.setSelectFieldValue('class', value)}
              errorText={this.getValidationMessages('class').join(' ')}/>
          </div>
        </Dialog.ContentSection>
        <Dialog.ContentSection>
          <div className="col-flex-1">
            {fields}
          </div>
          <div className="col-flex-1" style={{paddingLeft: 40}}>
            {options}
          </div>
        </Dialog.ContentSection>
      </Dialog.FullPage>
    );
  }
});
