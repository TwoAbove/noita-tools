it("Should load the ocr page and parse screenshot", () => {
  cy.visit(`/`);
  cy.get('li.nav-item:nth-child(3)').click();
  cy.get('.false > input:nth-child(5)', { timeout: 20000 }).should('be.visible').selectFile('cypress/fixtures/noita-screenshot.png')
  cy.get('.seed-info').should($div => {
    expect($div.first()).to.contain('Seed: 1239727788')
  })
});
