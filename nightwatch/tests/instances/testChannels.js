import Utils from '../../utils';

export default {
  tags: ['channels'],
  before(client) {
    const loginPage = client.page.loginPage();

    loginPage
      .navigate()
      .login(process.env.NIGHTWATCH_EMAIL, process.env.NIGHTWATCH_PASSWORD);
  },
  after(client) {
    client.end();
  },
  'User adds a Channel Socket': (client) => {
    const socketsPage = client.page.socketsPage();

    socketsPage
      .navigate()
      .waitForElementVisible('@channelSocketsListTitle')
      .clickElement('@addChannelButton')
      .waitForElementVisible('@addChannelModalTitle')
      .fillInput('@modalNameInput', 'channel')
      .clickElement('@confirmButton')
      .waitForElementVisible('@channelTableRow');
  },
  'User edits a Channel Socket': (client) => {
    const socketsPage = client.page.socketsPage();

    socketsPage
      .navigate()
      .waitForElementVisible('@channelSocketsListTitle')
      .clickElement('@channelSocketDropDown')
      .clickElement('@editDropdownItem')
      .waitForElementVisible('@editChannelModalTitle')
      .fillInput('@modalDescriptionInput', 'edit')
      .clickElement('@confirmButton')
      .waitForElementVisible('@channelTableRow')
      .waitForElementVisible('@channelTableRowDescription');

    socketsPage.verify.containsText('@channelTableRowDescription', Utils.addSuffix('edit'));
  },
  'User deletes a Channel Socket': (client) => {
    const socketsPage = client.page.socketsPage();

    socketsPage
      .navigate()
      .waitForElementVisible('@channelSocketsListTitle')
      .clickElement('@channelSocketDropDown')
      .clickElement('@deleteDropdownItem')
      .waitForElementVisible('@deleteChannelModalTitle')
      .clickElement('@confirmButton')
      .waitForElementNotPresent('@selectChannelTableRow');
  }
};
