const instancesCommands = {
  clickFAB() {
    return this.waitForElementVisible('@fab')
               .click('@fab')
               .waitForElementVisible('@confirmButton');
  },
  fillInstanceDescription(description) {
    return this.waitForElementVisible('@createModalDescriptionInput')
                .clearValue('@createModalDescriptionInput')
                .setValue('@createModalDescriptionInput', description);
  },
  clickSelectInstance() {
    return this.waitForElementVisible('@selectInstance').click('@selectInstance');
  },
  clickButton(button) {
    return this.waitForElementVisible(button).click(button);
  },
  clickDropdown(element) {
    return this.waitForElementVisible(element)
               .waitForElementNotPresent('@dropdownClickAnimation')
               .click(element);
  },
  isModalClosed(element) {
    return this.waitForElementNotVisible(element, 25000);
  }
};

export default {
  url: 'https://localhost:8080/#/instances',
  commands: [instancesCommands],
  elements: {
    instancesListMenu: {
      selector: '//div[@class="instances-list"]/div[1]/div[@class="col-menu"]//button',
      locateStrategy: 'xpath'
    },
    instancesItemDropdown: {
      selector: '//div[text()="Your first instance."]/following-sibling::div[@class="col-menu"]//button',
      locateStrategy: 'xpath'
    },
    instancesTable: {
      selector: 'div[id=instances]'
    },
    fab: {
      selector: '.synicon-plus'
    },
    createModalNameInput: {
      selector: 'input[name=name]'
    },
    createModalDescriptionInput: {
      selector: 'input[name=description]'
    },
    confirmButton: {
      selector: '//span[text()="Confirm"]',
      locateStrategy: 'xpath'
    },
    confirmDeleteButton: {
      selector: '//button//span[text()="Confirm"]',
      locateStrategy: 'xpath'
    },
    instancesTableRow: {
      selector: '//div[@class="description-field col-flex-1"]',
      locateStrategy: 'xpath'
    },
    instancesTableName: {
      selector: '//div[@class="instances-list"]/div[2]/div/div[1]/div[2]',
      locateStrategy: 'xpath'
    },
    selectInstance: {
      selector: '//div[@class="instances-list"]/div[2]/div[1]/div[1]//span',
      locateStrategy: 'xpath'
    },
    editDropdownItem: {
      selector: '//a[@class="dropdown-item-instance-edit"]',
      locateStrategy: 'xpath'
    },
    editButton: {
      selector: '.synicon-pencil'
    },
    deleteButton: {
      selector: '//div[text()="Delete Instance(s)"]',
      locateStrategy: 'xpath'
    },
    selectButton: {
      selector: '//div[text()="Select All"]',
      locateStrategy: 'xpath'
    },
    instanceSelected: {
      selector: '.synicon-checkbox-marked-outline'
    },
    instanceToSelect: {
      selector: '.synicon-checkbox-blank-outline'
    },
    instancesTableRowDescription: {
      selector: '//div[@class="instances-list"]/div[2]//div[@class="col-flex-1"]',
      locateStrategy: 'xpath'
    },
    emptyListItem: {
      selector: '.empty-list-item'
    },
    addInstanceModalTitle: {
      selector: '//h3[text()="Create an Instance"]',
      locateStrategy: 'xpath'
    },
    editInstanceModalTitle: {
      selector: '//h3[text()="Update an Instance"]',
      locateStrategy: 'xpath'
    },
    deleteInstanceModalTitle: {
      selector: '//h3[text()="Delete an Instance"]',
      locateStrategy: 'xpath'
    },
    welcomeDialogCreateInstance: {
      selector: '//div[@class="welcome-dialog"]//button',
      locateStrategy: 'xpath'
    },
    instanceDescription: {
      selector: '//div[@class="instances-list"]//*[text()="nightwatch_test_instance"]',
      locateStrategy: 'xpath'
    },
    socketsHeaderTitle: {
      selector: '//span[text()="Sockets"]',
      locateStrategy: 'xpath'
    },
    dropdownClickAnimation: {
      selector: '//span[@class="synicon-dots-vertical"]/preceding-sibling::span/div',
      locateStrategy: 'xpath'
    }
  }
};
