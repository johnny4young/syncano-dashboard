const utils = require('../utils');

module.exports = {
  tags: ['tasks'],
  before: function(client) {
    const loginPage = client.page.loginPage();

    loginPage.goToLoginPage();
    loginPage.typeEmail();
    loginPage.typePassword();
    loginPage.clickSignInButton();
    loginPage.verifyLoginSuccessful();
  },
  after: function(client) {
    client.end();
  },
  'Administrator adds a Schedule': function(client) {
    const tasksPage = client.page.tasksPage();
    const suffix = utils.addSuffix('schedule');

    tasksPage.navigate();
    tasksPage.clickButton('@addScheduleButton');
    tasksPage.waitForElementPresent('@addScheduleModalTitle');
    tasksPage.fillInputField('@addScheduleModalLabel', suffix);
    tasksPage.selectFromDropdown('@addScheduleModalCodeBox', '@addScheduleModalCodeBoxName');
    tasksPage.selectFromDropdown('@addScheduleModalCronTab', '@addScheduleModalCronTabName');
    tasksPage.waitForElementNotVisible('@runEvery5minutes')
    tasksPage.clickButton('@confirm');
    tasksPage.waitForElementPresent('@scheduleTableRow');
  },
  'Administrator edits a Schedule Crontab' : function(client) {
    const tasksPage = client.page.tasksPage();

    tasksPage.navigate();
    tasksPage.clickButton('@selectScheduleTableRow');
    tasksPage.clickButton('@editButton');
    tasksPage.waitForElementPresent('@editScheduleModalTitle');
    tasksPage.selectFromDropdown('@addScheduleModalCronTab', '@runEvery5minutes');
    tasksPage.waitForElementNotVisible('@addScheduleModalCronTabName')
    tasksPage.clickButton('@confirm');
    tasksPage.waitForElementPresent('@cronTabScheduleTableRow');
  },
  'Administrator deletes a Schedule' : function(client) {
    const tasksPage = client.page.tasksPage();

    tasksPage.navigate();
    tasksPage.clickButton('@selectScheduleTableRow');
    tasksPage.clickButton('@deleteButton');
    tasksPage.waitForElementPresent('@deleteScheduleModalTitle');
    client.pause(1000);
    tasksPage.clickButton('@confirm');
    tasksPage.waitForElementNotPresent('@selectScheduleTableRow');
  },
  'Administrator adds a Trigger': function(client) {
    const tasksPage = client.page.tasksPage();
    const suffix = utils.addSuffix('trigger');

    tasksPage.navigate();
    tasksPage.clickButton('@addTriggerButton');
    tasksPage.waitForElementPresent('@addTriggerModalTitle');
    tasksPage.fillInputField('@addTriggerModalLabel', suffix);
    tasksPage.selectFromDropdown('@addTriggerModalCodeBox', '@addScheduleModalCodeBoxName');
    tasksPage.selectFromDropdown('@addTriggerModalSignal', '@addTriggerModalSignalCreate');
    tasksPage.selectFromDropdown('@addTriggerModalClass', '@addTriggerModalClassName');
    tasksPage.waitForElementNotVisible('@addTriggerModalClassName');
    tasksPage.clickButton('@confirm');
    tasksPage.waitForElementPresent('@triggerTableRow');
  },
  'Administrator edits a Trigger Signal' : function(client) {
    const tasksPage = client.page.tasksPage();

    tasksPage.navigate();
    tasksPage.clickButton('@selectTriggerTableRow');
    tasksPage.clickButton('@editButton');
    tasksPage.waitForElementPresent('@confirm');
    tasksPage.selectFromDropdown('@addTriggerModalSignal', '@addTriggerModalSignalUpdate');
    tasksPage.waitForElementNotVisible('@addTriggerModalSignalUpdate')
    tasksPage.clickButton('@confirm');
    tasksPage.waitForElementPresent('@signalTriggerTableRow');
  },
  'Administrator deletes a Trigger' : function(client) {
    const tasksPage = client.page.tasksPage();

    tasksPage.navigate();
    tasksPage.clickButton('@selectTriggerTableRow');
    tasksPage.clickButton('@deleteButton');
    tasksPage.waitForElementVisible('@confirm');
    client.pause(1000);
    tasksPage.clickButton('@confirm');
    tasksPage.waitForElementNotPresent('@selectTriggerTableRow');
  }
}
