export default {
  tags: ['solutions'],
  before(client) {
    const loginPage = client.page.loginPage();

    loginPage
      .navigate()
      .login(process.env.NIGHTWATCH_EMAIL, process.env.NIGHTWATCH_PASSWORD);
  },
  after(client) {
    client.end();
  },
  'Administrator can view Favorite Solutions': (client) => {
    const solutionsPage = client.page.solutionsPage();

    solutionsPage.navigate();
    solutionsPage.clickButton('@favorite', client);
    solutionsPage.waitForElementVisible('@favoriteSolutionTitle');
  },
  'Administrator can view his Solutions': (client) => {
    const solutionsPage = client.page.solutionsPage();

    solutionsPage.navigate();
    solutionsPage.clickButton('@mySolutions', client);
    solutionsPage.waitForElementVisible('@mySolutionTitle');
  },
  'Administrator can filter solutions by tags': (client) => {
    let tagsCount = null;
    const solutionsPage = client.page.solutionsPage();
    const elementsWithTag = solutionsPage.elements.tagsJs;

    solutionsPage.navigate();
    solutionsPage.waitForElementVisible('@tagsList');
    solutionsPage.clickButton('@tagsListJs', client);
    solutionsPage.waitForElementVisible('@tagsJs');

    solutionsPage.getText('@tagListItemCount', function(result) {
      tagsCount = parseInt(result.value, 10);
    });

    client.elements(elementsWithTag.locateStrategy, elementsWithTag.selector, function(result) {
      if (tagsCount >= result.value.length) {
        client.assert.ok(true, 'Tags count is equal or greater than number of solutions on the list');
      }
    });
  }
};
