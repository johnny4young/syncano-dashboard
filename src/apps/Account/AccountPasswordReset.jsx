import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';

// Utils
import {FormMixin} from '../../mixins';

// Stores and Actions
import Store from './AuthStore';
import Actions from './AuthActions';

// Components
import {TextField, RaisedButton} from 'syncano-material-ui';
import AccountContainer from './AccountContainer';

let Link = Router.Link;

export default React.createClass({

  displayName: 'AccountPasswordReset',

  mixins: [
    Reflux.connect(Store),
    FormMixin
  ],

  validatorConstraints: {
    email: {
      presence: true,
      email: {
        message: '^Invalid email address'
      }
    }
  },


  handleSuccessfullValidation() {
    Actions.passwordReset(this.state.email);
  },

  render() {
    return (
      <AccountContainer>
        <div className="account-container__content__header">
          <p className="">Reset your password</p>
        </div>
        {this.renderFormNotifications()}
        <form
          onSubmit={this.handleFormValidation}
          className="account-container__content__form"
          acceptCharset="UTF-8"
          method="post">

          <TextField
            ref="email"
            valueLink={this.linkState('email')}
            errorText={this.getValidationMessages('email').join(' ')}
            name="email"
            className="text-field vm-4-b"
            autoComplete="email"
            hintText="Your email"
            fullWidth={true}/>

          <RaisedButton
            type="submit"
            label="Reset password"
            fullWidth={true}
            labelStyle={{fontSize: '16px'}}
            style={{boxShadow: 'none', height: '48px'}}
            primary={true}/>
        </form>
        <div className="account-container__content__footer">
          <ul className="list--flex list--horizontal">
            <li><p><Link to="signup">Create your account</Link></p></li>
            <li><p>Already have an account? <Link to="login">Login</Link></p></li>
          </ul>
        </div>
      </AccountContainer>
    );
  }
});
