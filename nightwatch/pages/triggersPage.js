import utils from '../utils';
import globals from '../globals';
import commonCommands from '../commands/commonCommands';

export default {
  url: `https://localhost:8080/#/instances/${globals.instanceName}/triggers`,
  commands: [commonCommands],
  elements: {
    triggersListMenu: {
      selector: '//div[@class="triggers-list"]/div[1]/div[@class="col-menu"]//button',
      locateStrategy: 'xpath'
    },
    triggerDropdown: {
      selector: `//div[text()="${utils.addSuffix('trigger')}"]/../../following-sibling::div[@class="col-menu"]//button`,
      locateStrategy: 'xpath'
    },
    editDropdownItem: {
      selector: '//a[@class="dropdown-item-edit"]',
      locateStrategy: 'xpath'
    },
    confirm: {
      selector: '//span[text()="Confirm"]',
      locateStrategy: 'xpath'
    },
    triggersDeleteButton: {
      selector: '//div[text()="Delete a Trigger Socket"]',
      locateStrategy: 'xpath'
    },
    triggersEditButton: {
      selector: '//span[text()="Edit a Trigger Socket"]',
      locateStrategy: 'xpath'
    },
    triggerListItem: {
      selector: '//div[text()="trigger_123"]',
      locateStrategy: 'xpath'
    },
    addScheduleModalSnippetName: {
      selector: '//div[text()="snippet"]',
      locateStrategy: 'xpath'
    },
    runEvery5minutes: {
      selector: '//span[text()="Run every 5 minutes"]',
      locateStrategy: 'xpath'
    },
    addTriggerButton: {
      selector: '//button//span[@class="synicon-socket-trigger"]',
      locateStrategy: 'xpath'
    },
    addTriggerModalTitle: {
      selector: '//h3[text()="Create a Trigger Socket"]',
      locateStrategy: 'xpath'
    },
    addTriggerModalLabel: {
      selector: '//input[@name="label"]',
      locateStrategy: 'xpath'
    },
    addTriggerModalSignal: {
      selector: '//div[@class="signal-dropdown"]',
      locateStrategy: 'xpath'
    },
    addTriggerModalSignalCreate: {
      selector: '//div[text()="create"]',
      locateStrategy: 'xpath'
    },
    addTriggerModalClass: {
      selector: '//div[@class="class-dropdown"]',
      locateStrategy: 'xpath'
    },
    addTriggerModalClassName: {
      selector: '//div[text()="user_profile"]',
      locateStrategy: 'xpath'
    },
    addTriggerModalSnippet: {
      selector: '//div[@class="snippet-dropdown"]',
      locateStrategy: 'xpath'
    },
    triggerTableRow: {
      selector: `//div[text()="${ utils.addSuffix('trigger')}"]`,
      locateStrategy: 'xpath'
    },
    selectTriggerTableRow: {
      selector: `//div[text()="${ utils.addSuffix('trigger')}"]/../../preceding-sibling::div`,
      locateStrategy: 'xpath'
    },
    addTriggerModalSignalUpdate: {
      selector: '//div[text()="update"]',
      locateStrategy: 'xpath'
    },
    signalTriggerTableRow: {
      selector: `//div[text()="${utils.addSuffix('trigger')}"]/../parent::div/following-sibling::div[text()="post_update"]`,
      locateStrategy: 'xpath'
    }
  }
};
