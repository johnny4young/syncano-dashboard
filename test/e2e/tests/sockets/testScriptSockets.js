import accounts from '../../tempAccounts';
import utils, { addTestNamePrefixes } from '../../utils';

export default addTestNamePrefixes({
  tags: ['scriptSockets'],
  before(client) {
    const loginPage = client.page.loginPage();
    const { email, password } = accounts.alternativeUser;

    loginPage
      .navigate()
      .setResolution(client)
      .login(email, password);
  },
  after(client) {
    client.end();
  },
  'User adds a Script Socket': (client) => {
    const socketsPage = client.page.socketsPage();
    const script = utils.addSuffix('script');
    const { instanceName } = accounts.alternativeUser;


    socketsPage
      .goToUrl(instanceName, 'script-endpoints')
      .clickElement('@addScriptButton')
      .fillInput('@modalNameInput', script)
      .selectDropdownValue('@addCodeBoxModalScriptDropdown', accounts.alternativeUser.tempScriptNames[0])
      .clickElement('@confirmButton')
      .clickElement('@summaryDialogCloseButton')
      .waitForElementVisible('@codeBoxTableRow');
  },
  'User edits a Script Socket': (client) => {
    const socketsPage = client.page.socketsPage();
    const edited = utils.addSuffix('edited');

    socketsPage
      .clickListItemDropdown(utils.addSuffix('script'), 'Edit')
      .waitForElementVisible('@editCodeBoxModalTitle')
      .fillInput('@modalDescriptionInput', edited)
      .clickElement('@confirmButton')
      .waitForElementVisible('@codeBoxTableRow')
      .waitForElementVisible('@codeBoxTableRowDescription');

    socketsPage.verify.containsText('@codeBoxTableRowDescription', edited);
  },
  'User deletes a Script Socket': (client) => {
    const socketsPage = client.page.socketsPage();
    const script = utils.addSuffix('script');

    socketsPage
      .clickListItemDropdown(script, 'Delete')
      .waitForElementVisible('@deleteCodeBoxModalTitle')
      .clickElement('@confirmButton')
      .waitForElementNotPresent('@codeBoxTableRow');
  }
});
