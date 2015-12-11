import utils from '../../utils';

export default {
  tags: ['administrators'],
  before: (client) => {
    const loginPage = client.page.loginPage();

    loginPage
      .navigate()
      .login(process.env.NIGHTWATCH_EMAIL, process.env.NIGHTWATCH_PASSWORD);
  },
  after: (client) => {
    client.end();
  },
  'User adds an Administrator': (client) => {
    const email = utils.addSuffix('admin') + '@syncano.com';
    const adminsPage = client.page.adminsPage();

    adminsPage.navigate()
      .waitForElementVisible('@adminsListItem')
      .clickButton('@addAdminButton')
      .waitForElementVisible('@addAdminModalTitle')
      .fillInputField('@addAdminModalEmailInput', email)
      .selectFromDropdown('@addAdminModalRoleDropdown', '@addAdminModalRoleDropdownRead')
      .clickButton('@confirmButton')
      .waitForElementVisible('@adminEmailTableRow');
  },
  'User deletes an Administrator': (client) => {
    const adminsPage = client.page.adminsPage();

    adminsPage.navigate()
      .clickButton('@selectAdminTableRow')
      .clickButton('@adminsListMenu')
      .clickButton('@deleteButton')
      .waitForElementVisible('@deleteAdminModalTitle');

    client.pause(1000);

    adminsPage.clickButton('@confirmButton');
    client.pause(1000);
    adminsPage
      .waitForElementVisible('@adminTableRow')
      .waitForElementNotPresent('@adminEmailTableRow');
  }
};
