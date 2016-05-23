import Async from 'async';
import globals from '../../globals';

export default {
  tags: ['templates'],
  after(client) {
    client.end();
  },
  before(client) {
    Async.waterfall([
      client.createTempAccount,
      client.createTempInstance
    ], (err) => {
      if (err) throw err;
      const loginPage = client.page.loginPage();

      loginPage
        .navigate()
        .setResolution(client)
        .login(globals.tempEmail, globals.tempPass);
    });
  },
  'Test Select/Deselect multiple Templates': (client) => {
    const listsPage = client.page.listsPage();
    const selectedItems = listsPage.elements.selectedItem.selector;

    listsPage
      .goToUrl('temp', 'templates')
      .clickListItemDropdown('@optionsMenu', 'Select')
      .assertSelectedCount('xpath', selectedItems, 2);

    client
      .pause(2000);

    listsPage
      .clickListItemDropdown('@optionsMenu', 'Unselect')
      .assertSelectedCount('xpath', selectedItems, 0);
  },
  'Test Delete multiple Templates': (client) => {
    const listsPage = client.page.listsPage();

    client
      .pause(2000);

    listsPage
      .goToUrl('temp', 'templates')
      .clickListItemDropdown('@optionsMenu', 'Select');

    client
      .pause(2000);

    listsPage
      .clickListItemDropdown('@optionsMenu', 'Delete')
      .clickElement('@confirmButton')
      .waitForElementVisible('@emptyListItem');
  }
};
