import Globals from '../../globals';
import async from 'async';

export default {
  tags: ['instances'],
  after(client) {
    client.end();
  },
  'Test create instances': (client) => {
    async.waterfall([
      client.createTempAccount,
      client.createTempInstance
    ], (err) => {
      if (err) throw err;
      const loginPage = client.page.loginPage();

      loginPage
        .navigate()
        .waitForElementPresent('@emailInput', 60000)
        .login(Globals.tempEmail, Globals.tempPass);
    });
  },
  'Test Instances Dropdown': (client) => {
    const instancesPage = client.page.instancesPage();
    const leftMenuPage = client.page.leftMenuPage();
    const socketsPage = client.page.socketsPage();

    const instanceNames = [];

    instancesPage.navigate();
    instancesPage.waitForElementPresent('@instancesTableName');
    const instanceName = instancesPage.elements.instancesTableName;

    client.elements(instanceName.locateStrategy, instanceName.selector, (result) => {
      result.value.forEach((value) => {
        client.elementIdText(value.ELEMENT, (el) => {
          instanceNames.push(el.value);
        });
      });
    });
    instancesPage.waitForElementPresent('@instancesTableName');
    instancesPage.clickButton('@instancesTableName', client);
    leftMenuPage.clickButton('@instancesDropdown', client);
    leftMenuPage.clickButton('@instancesListSecondItem', client);
    socketsPage.waitForElementPresent('@emptySocketsHeading');
    const dropdown = leftMenuPage.elements.instancesDropdownName.selector;

    client.getText('xpath', dropdown, (text) => {
      client.assert.equal(text.value, instanceNames[0]);
    });
  }
  // Deleted Fabs cousing this test fails so it will be enabled when delete button on toolbar will be added
  //'Test Select and Delete multiple Instances': (client) => {
  //  const instancesPage = client.page.instancesPage();
  //
  //  instancesPage
  //    .navigate()
  //    .waitForElementPresent('@selectInstance')
  //    .moveToElement('@selectInstance', 0, 0)
  //    .clickButton('@instanceToSelect')
  //    .clickButton('@selectButton')
  //    .clickButton('@deleteButton');
  //  client.pause(1000);
  //  instancesPage
  //    .clickButton('@confirmDeleteButton')
  //    .waitForElementNotVisible('@deleteInstanceModalTitle');
  //
  //  instancesPage.expect.element('@emptyListItem').to.be.present.after(10000);
  //}
};