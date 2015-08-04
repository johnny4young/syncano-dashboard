import React from 'react';
import Router from 'react-router';

// Pages
import App from './pages/app.react';
import Dashboard from './pages/dashboard.react';
import Instance from './pages/instance.react';
import ProfilePage from './pages/profile.react';
import CodeBoxesPage from './pages/codeBoxes.react';
import NotFound from './pages/notfound.react';

// Apps
import Profile from './apps/Profile';
import Account from './apps/Account';

// Apps for authenticated users
import Instances from './apps/Instances/Instances.react';
import Solutions from './apps/Solutions';

// Instance Apps
import Admins from './apps/Admins/Admins.react';
import ApiKeys from './apps/ApiKeys/ApiKeys.react';
import Classes from './apps/Classes/Classes.react';
import CodeBoxes from './apps/CodeBoxes';
import DataObjects from './apps/DataObjects/DataObjects.react';
import Data from './apps/Data';
import Tasks from './apps/Tasks/Tasks.react';
import Users from './apps/Users/Users.react';
import Channels from './apps/Channels/Channels.react';

// Examples
import Examples from './examples/Examples.react';
import ListExamples from './examples/ListExamples.react';

const Route = Router.Route;
const Redirect = Router.Redirect;
const NotFoundRoute = Router.NotFoundRoute;
const DefaultRoute = Router.DefaultRoute;

module.exports = (
  <Route
    name="app"
    handler={App}
    path="/"
    >
    <NotFoundRoute handler={NotFound}/>
    <Route
      name="login"
      handler={Account.Login}
      />
    <Route
      name="signup"
      handler={Account.Signup}
      />
    <Route
      name="activate"
      handler={Account.Activate}
      path="/activate/:uid/:token"
      />
    <Route
      name="password-update"
      handler={Account.PasswordUpdate}
      path="/password/update"
      />
    <Route
      name="password-reset"
      handler={Account.PasswordReset}
      path="/password/reset"
      />
    <Route
      name="password-reset-confirm"
      handler={Account.PasswordResetConfirm}
      path="/password/reset/:uid/:token"
      />

    {/* Dashboard */}
    <Route
      name="dashboard"
      handler={Dashboard}
      path="/">
      <Route
        name="instance"
        handler={Instance}
        path="instance/:instanceName">

        <DefaultRoute handler={Data}/>

        {/* Data */}
        <Route
          name="data"
          path="data"
          >

          {/* Webhook Traces */}
          <Route
            name='webhook-traces'
            handler={Data.WebhookTraces}
            path='webhook/:webhookName/traces'
            />

          <DefaultRoute handler={Data}/>

        </Route>

        {/* Admins */}
        <Route
          name="admins"
          handler={Admins}
          path="admins"
          />

        {/* API keys */}
        <Route
          name="api-keys"
          handler={ApiKeys}
          path="api_keys"
          />

        {/* Classes */}
        <Route
          name="classes"
          path="classes">

          {/* Classes - Data Objects */}
          <Route
            name="classes-data-objects"
            handler={DataObjects}
            path=":className/objects"
            />

          <DefaultRoute handler={Classes}/>
        </Route>

        {/* CodeBoxes */}
        <Route
          name="codeboxes"
          handler={CodeBoxesPage}
          path="codeboxes">
          <Route
            name="codebox"
            handler={CodeBoxes.Details}
            path=":codeboxId">
            <Route
              name="codebox-traces"
              handler={CodeBoxes.Traces}
              path="traces"
              />
            <Route
              name="codebox-edit"
              handler={CodeBoxes.Edit}
              path="edit"
              />
            <Route
              name="codebox-config"
              handler={CodeBoxes.Config}
              path="config"/>
            <DefaultRoute handler={CodeBoxes.Edit}/>
          </Route>
          <DefaultRoute handler={CodeBoxes}/>
        </Route>
        <Route
          name="codeboxes-add"
          handler={CodeBoxes}
          path="codeboxes/:action"
          />

        {/* Data Objects */}
        <Route
          name="data-objects"
          handler={DataObjects}
          path="objects"
          />

        {/* Tasks */}
        <Route
          name="tasks"
          handler={Tasks}
          path="tasks"
          />

        {/* Channels */}
        <Route
          name="channels"
          handler={Channels}
          path="channels"
          />

        {/* Users */}
        <Route
          name="users"
          handler={Users}
          path="users"
          />

      </Route>

      {/* Profile Billing */}
      <Route
        name="profile"
        handler={ProfilePage}
        path="/account"
        >
        <Route
          name="profile-billing-plan"
          handler={Profile.BillingPlan}
          path="plan"
          />
        <Route
          name="profile-billing-address"
          handler={Profile.BillingAddress}
          path="address"
          />
        <Route
          name="profile-billing-payment"
          handler={Profile.BillingPayment}
          path="payment-methods"
          />
        <Route
          name="profile-billing-invoices"
          handler={Profile.BillingInvoices}
          path="invoices"
          />
        <Route
          name="profile-settings"
          handler={Profile.Settings}
          path="/account"/>
        <Route
          name="profile-authentication"
          handler={Profile.Authentication}
          path="/account/authentication"
          />
        <Route
          name="profile-invitations"
          handler={Profile.Invitations}
          path="/account/invitations"
          />
        <DefaultRoute handler={Profile.BillingPlan}/>
      </Route>

      {/* Solutions */}
      <Route
        name="solutions"
        path="/solutions"
        >
        <Route
          name="solutions-list"
          handler={Solutions.ListView}
          path="list"
          />
        <Route
          name="solutions-install"
          handler={Solutions.EditView}
          path="/solutions/:solutionId/:action"
          />
        <Route
          name="solutions-edit"
          handler={Solutions.EditView}
          path="/solutions/:solutionId/edit"
          />
        <Route
          name="solutions-add-version"
          handler={Solutions.AddVersionView}
          path="/solutions/:solutionId/versions/add"
          />
        <Redirect
          from="/solutions"
          to="solutions-list"
          />
        <DefaultRoute handler={Solutions.ListView}/>
      </Route>

      <DefaultRoute handler={Instances}/>
    </Route>

    {/* Examples */}
    <Route
      name="examples"
      handler={Examples}
      />
    <Route
      name="listsexamples"
      handler={ListExamples}
      />
  </Route>
);
