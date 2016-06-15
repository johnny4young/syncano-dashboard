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
import {TextField, Toggle, Checkbox, AutoComplete} from 'material-ui';
import {SelectFieldWrapper, Show, Dialog, Notification, Editor} from '../../common/';

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
    },
    query: (value) => {
      try {
        JSON.parse(value);
      } catch (e) {
        return {
          inclusion: {
            within: [],
            message: 'is not a valid JSON'
          }
        };
      }
      return null;
    }
  },

  getDataEnpointParams() {
    const {name, description, order_by, page_size, excluded_fields, expand, query} = this.state;
    const className = this.state.class;
    const params = {
      class: className,
      query: JSON.parse(query) || {},
      name,
      description,
      order_by,
      page_size,
      excluded_fields,
      expand
    };

    return params;
  },

  isActualClass() {
    return ClassesStore.getClassByName(this.state.class);
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
    if (!this.isActualClass()) {
      return Actions.createDataEndpointWithClass(this.getDataEnpointParams());
    }

    return Actions.createDataEndpoint(this.getDataEnpointParams());
  },

  handleEditSubmit() {
    const params = this.getDataEnpointParams();

    if (!this.isActualClass()) {
      return Actions.updateDataEndpointWithClass(params.name, params);
    }

    return Actions.updateDataEndpoint(params.name, params);
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
                onToggle={this.handleToggle.bind(this, 'showFields', field.name)} />
            </div>
            <div className="col-xs-8">
              <Show if={field.type === 'reference' || field.type === 'relation'}>
                <Checkbox
                  name="expand"
                  defaultChecked={this.isEnabled(this.state.expand, field.name)}
                  disabled={this.isEnabled(this.state.excluded_fields, field.name)}
                  onCheck={this.handleToggle.bind(this, 'expandFields', field.name)} />
              </Show>
            </div>
          </div>
        );
      }));
    }
  },

  renderOptions() {
    console.info('DataEndpointDialog::renderOrderBy', this.state.class);
    const orderFields = ClassesStore.getClassOrderFieldsPayload(this.state.class);
    let orderField = (
      <div
        key="options_header"
        style={{
          paddingTop: 24,
          paddingBottom: 24
        }}>
        <Notification>Add schema fields with order index</Notification>
      </div>
    );

    if (orderFields.length) {
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

    return (
      <div>
        <div>Response options</div>
        {orderField}
      </div>
    );
  },

  render() {
    const title = this.hasEditMode() ? 'Edit' : 'Add';
    const {open, isLoading, canSubmit, classes} = this.state;
    const submitLabel = !ClassesStore.getClassByName(this.state.class) ? 'Confirm and create a class' : 'Confirm';
    const filteringUrl = 'http://docs.syncano.io/docs/data-objects-filtering-ordering#filtering-data-objects';

    return (
      <Dialog.FullPage
        key="dialog"
        ref="dialog"
        title={`${title} a Data Endpoint`}
        onRequestClose={this.handleCancel}
        open={open}
        isLoading={isLoading}
        actions={
          <Dialog.StandardButtons
            disabled={!canSubmit}
            submitLabel={submitLabel}
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
            <Dialog.SidebarSection title="Query">
              {`In this field you can specify a filtering method just as you would when using `}
              <Dialog.SidebarLink to={filteringUrl}>
                Data Objects filtering.
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
        <Dialog.ContentSection noMargin={true}>
          <div className="col-flex-1">
            <TextField
              ref="name"
              name="name"
              autoFocus={true}
              fullWidth={true}
              disabled={this.hasEditMode()}
              value={this.state.name}
              onChange={(event, value) => this.setState({name: value})}
              errorText={this.getValidationMessages('name').join(' ')}
              hintText="Data Endpoint's name"
              floatingLabelText="Name"/>
          </div>
          <div
            className="col-flex-1"
            style={{paddingLeft: 15}}>
            <TextField
              ref="description"
              name="description"
              fullWidth={true}
              value={this.state.description}
              onChange={(event, value) => this.setState({description: value})}
              errorText={this.getValidationMessages('description').join(' ')}
              hintText="Data Endpoint's description"
              floatingLabelText="Description (optional)"/>
          </div>
        </Dialog.ContentSection>
        <Dialog.ContentSection noMargin={true}>
          <div className="col-flex-1">
            <TextField
              ref="page_size"
              name="page_size"
              fullWidth={true}
              value={this.state.page_size}
              onChange={(event, value) => this.setState({page_size: value})}
              errorText={this.getValidationMessages('page_size').join(' ')}
              hintText="Number"
              floatingLabelText="Number of records in data set"/>
          </div>
        </Dialog.ContentSection>
        <Dialog.ContentSection>
          <div className="col-flex-1" style={{position: 'relative'}}>
            <AutoComplete
              ref="class"
              name="class"
              floatingLabelText="Class"
              hintText="Start typing to see matching classes list or type a new class name"
              filter={(searchText, key) => !searchText ? true : searchText !== '' && key.includes(searchText)}
              dataSource={classes}
              searchText={this.state.class}
              onNewRequest={(value) => this.setState({class: value})}
              onUpdateInput={(value) => this.setState({class: value})}
              fullWidth={true}
              openOnFocus={true}
              errorText={this.getValidationMessages('class').join(' ')}/>
          </div>
        </Dialog.ContentSection>
        <Dialog.ContentSection
          style={{paddingTop: 16}}
          title="query">
          <Editor
            name="query-editor"
            ref="queryEditor"
            mode="json"
            height="300px"
            onChange={(query) => this.setState({query})}
            value={[
              '{',
              '  ',
              '}'
            ].join('\n')} />
          <div className="vm-2-t">
            <Show if={this.getValidationMessages('query').length}>
              <Notification type="error">
                {this.getValidationMessages('query').join(' ')}
              </Notification>
            </Show>
          </div>
        </Dialog.ContentSection>
        <Dialog.ContentSection
          style={{paddingTop: 16}}
          title="class fields & ordering">
          <div className="col-flex-1">
            {this.renderFields()}
          </div>
          <div className="col-flex-1" style={{paddingLeft: 15}}>
            {this.renderOptions()}
          </div>
        </Dialog.ContentSection>
      </Dialog.FullPage>
    );
  }
});
