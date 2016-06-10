import Async from 'async';
import globals from '../../globals';
import utils from '../../utils';

export default {
  tags: ['pushDevice'],
  before: (client) => {
    Async.waterfall([
      client.createTempAccount,
      client.createTempInstance,
      client.configTempAPNSPushNotificationSocket,
      client.configTempGCMPushNotificationSocket
    ], (err) => {
      if (err) throw err;
      const loginPage = client.page.loginPage();

      loginPage
        .navigate()
        .setResolution(client)
        .login(globals.tempEmail, globals.tempPass);
    });
  },
  after: (client) => {
    client.end();
  },
  'Test Admin Adds Android Device': (client) => {
    const pushDevicesPage = client.page.pushDevicesPage();
    const listsPage = client.page.listsPage();
    const labelName = utils.addSuffix('androidlabel');
    const registrationId = utils.randomString(64);
    const deviceId = utils.randomInt(100, 1000);

    pushDevicesPage
      .goToUrl('temp', 'push-notifications/devices/gcm')
      .waitForElementVisible('@androidDevicesHeading');

    client.pause(500);

    listsPage
      .clickElement('@addButton')
      .fillInput('@inputLabel', labelName)
      .fillInput('@inputRegistrationId', registrationId)
      .fillInput('@inputDeviceId', deviceId)
      .clickElement('@confirmButton')
      .waitForElementNotPresent('@addTitleHeading');

    pushDevicesPage
      .verify.containsText('@firstDevice', labelName);
  },
  'Test Admin Edits Android Device': (client) => {
    const pushDevicesPage = client.page.pushDevicesPage();
    const listsPage = client.page.listsPage();
    const labelName = utils.addSuffix('androidlabel');
    const deviceId = utils.randomInt(100, 1000);

    pushDevicesPage
      .goToUrl('temp', 'push-notifications/devices/gcm')
      .waitForElementVisible('@androidDevicesHeading');

    listsPage
      .clickListItemDropdown('@firstItemOptionsMenu', 'Edit')
      .fillInput('@inputLabel', labelName)
      .fillInput('@inputDeviceId', deviceId)
      .clickElement('@confirmButton')
      .waitForElementNotPresent('@addTitleHeading');

    pushDevicesPage
      .verify.containsText('@firstDevice', labelName);
  },
  'Test Admin Selects/Deselects Android Device': (client) => {
    const listsPage = client.page.listsPage();
    const selectedItem = listsPage.elements.selectedItem.selector;
    const optionsMenu = listsPage.elements.firstItemOptionsMenu.selector;

    client
      .goToUrl('temp', 'push-notifications/devices/gcm')
      .singleItemSelectUnselect('synicon-android', optionsMenu, selectedItem);
  },
  'Test Admin Deletes Android Device': (client) => {
    const pushDevicesPage = client.page.pushDevicesPage();
    const listsPage = client.page.listsPage();

    pushDevicesPage
      .goToUrl('temp', 'push-notifications/devices/gcm')
      .waitForElementVisible('@androidDevicesHeading');

    listsPage
      .waitForElementVisible('@firstItemOptionsMenu')
      .clickListItemDropdown('@firstItemOptionsMenu', 'Delete')
      .waitForElementVisible('@deleteTitleHeading')
      .clickElement('@confirmButton')
      .waitForElementNotPresent('@deleteTitleHeading')
      .waitForElementVisible('@emptyListItem');
  },
  'Test Admin Adds iOS Device': (client) => {
    const pushDevicesPage = client.page.pushDevicesPage();
    const listsPage = client.page.listsPage();
    const labelName = utils.addSuffix('ioslabel');
    const registrationId = utils.randomString(64);

    pushDevicesPage
      .goToUrl('temp', 'push-notifications/devices/apns')
      .waitForElementVisible('@iosDevicesHeading');

    client.pause(500);

    listsPage
      .clickElement('@addButton')
      .fillInput('@inputLabel', labelName)
      .fillInput('@inputRegistrationId', registrationId)
      .clickElement('@confirmButton')
      .waitForElementNotPresent('@addTitleHeading');

    pushDevicesPage
      .verify.containsText('@firstDevice', labelName);
  },
  'Test Admin Edits iOS Device': (client) => {
    const pushDevicesPage = client.page.pushDevicesPage();
    const listsPage = client.page.listsPage();
    const labelName = utils.addSuffix('ioslabel');

    pushDevicesPage
      .goToUrl('temp', 'push-notifications/devices/apns')
      .waitForElementVisible('@iosDevicesHeading');

    listsPage
      .clickListItemDropdown('@firstItemOptionsMenu', 'Edit')
      .fillInput('@inputLabel', labelName)
      .clickElement('@confirmButton')
      .waitForElementNotPresent('@addTitleHeading');

    pushDevicesPage
      .verify.containsText('@firstDevice', labelName);
  },
  'Test Admin Selects/Deselects iOS Device': (client) => {
    const listsPage = client.page.listsPage();
    const selectedItem = listsPage.elements.selectedItem.selector;
    const optionsMenu = listsPage.elements.firstItemOptionsMenu.selector;

    client
      .goToUrl('temp', 'push-notifications/devices/apns')
      .singleItemSelectUnselect('synicon-apple', optionsMenu, selectedItem);
  },
  'Test Admin Deletes iOS Device': (client) => {
    const pushDevicesPage = client.page.pushDevicesPage();
    const listsPage = client.page.listsPage();

    pushDevicesPage
      .goToUrl('temp', 'push-notifications/devices/apns')
      .waitForElementVisible('@iosDevicesHeading');

    listsPage
      .waitForElementVisible('@firstItemOptionsMenu')
      .clickListItemDropdown('@firstItemOptionsMenu', 'Delete')
      .waitForElementVisible('@deleteTitleHeading')
      .clickElement('@confirmButton')
      .waitForElementNotPresent('@deleteTitleHeading')
      .waitForElementVisible('@emptyListItem');
  }
};
