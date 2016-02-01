export default {
  tags: ['signup'],
  'User signs up': (client) => {
    const signupPage = client.page.signupPage();
    const instancesPage = client.page.instancesPage();
    const slug = Date.now();

    signupPage
      .navigate()
      .setValue('@emailInput', 'syncano.bot+' + slug + '@syncano.com')
      .setValue('@passInput', slug)
      .click('@submitButton');

    client.pause(5000).refresh();

    instancesPage.expect.element('@instancesHeaderTitle').to.be.present.after(2000);
    client.end();
  }
};
