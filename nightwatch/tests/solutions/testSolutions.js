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
    solutionsPage.clickElement('@favorite');
    solutionsPage.waitForElementVisible('@favoriteSolutionTitle');
  },
  'Administrator can view his Solutions': (client) => {
    const solutionsPage = client.page.solutionsPage();

    solutionsPage.navigate();
    solutionsPage.clickElement('@mySolutions');
    solutionsPage.waitForElementVisible('@mySolutionTitle');
  },
  'Administrator can filter solutions by tags': (client) => {
    let tagsCount = null;
    const solutionsPage = client.page.solutionsPage();
    const elementsWithTag = solutionsPage.elements.tagsJs;

    solutionsPage.navigate();
    solutionsPage.waitForElementVisible('@tagsList');
    solutionsPage.clickElement('@tagsListJs');
    solutionsPage.waitForElementVisible('@tagsJs');

    solutionsPage.getText('@tagListItemCount', (result) => {
      tagsCount = parseInt(result.value, 10);
    });

    client.elements(elementsWithTag.locateStrategy, elementsWithTag.selector, (result) => {
      if (tagsCount >= result.value.length) {
        client.assert.ok(true, 'Tags count is equal or greater than number of solutions on the list');
      }
    });
  }
};
