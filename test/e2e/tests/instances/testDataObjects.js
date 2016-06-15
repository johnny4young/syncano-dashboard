import accounts from '../../tempAccounts';
import Utils from '../../utils';

export default {
  tags: ['dataObjects'],
  before(client) {
    const loginPage = client.page.loginPage();

    loginPage
      .navigate()
      .setResolution(client)
      .login(accounts.alternativeUser.email, accounts.alternativeUser.password);
  },
  after(client) {
    client.end();
  },
  'Administrator adds a Data Object'(client) {
    const dataObjectsPage = client.page.dataObjectsPage();
    const string = Utils.addSuffix('string');
    const instanceName = accounts.alternativeUser.instanceName;
    const tempClassName = accounts.alternativeUser.tempClassNames[0];

    dataObjectsPage
      .goToUrl(instanceName, `classes/${tempClassName}/objects`)
      .clickElement('@addDataObjectButton')
      .fillInput('@stringField', string)
      .clickElement('@confirm')
      .waitForElementVisible('@stringFieldTableRow');
  }
  // 'Administrator edits a Data Object'(client) {
  //   const dataObjectsPage = client.page.dataObjectsPage();
  //   const edited = Utils.addSuffix('edited');
  //   const instanceName = accounts.alternativeUser.instanceName;
  //   const tempClassName = accounts.alternativeUser.tempClassNames[0];
  //
  //   dataObjectsPage
  //     .goToUrl(instanceName, `/classes/${tempClassName}/objects`)
  //     .clickElement('@stringFieldTableRow')
  //     .fillInput('@stringField', edited)
  //     .clickElement('@confirm')
  //     .waitForElementVisible('@stringFieldEditedTableRow');
  // },
  // 'Administrator deletes a Data Object'(client) {
  //   const dataObjectsPage = client.page.dataObjectsPage();
  //   const instanceName = accounts.alternativeUser.instanceName;
  //   const tempClassName = accounts.alternativeUser.tempClassNames[0];
  //
  //   dataObjectsPage
  //     .goToUrl(instanceName, `/classes/${tempClassName}/objects`)
  //     .waitForElementPresent('@stringFieldEditedTableRow')
  //     .clickElement('@selectDataObjectTableRow')
  //     .waitForElementNotPresent('@deleteDataObjectButtonDisabled')
  //     .clickElement('@deleteDataObjectButton')
  //     .clickElement('@confirm')
  //     .waitForElementNotPresent('@selectDataObjectTableRow');
  // }
};
