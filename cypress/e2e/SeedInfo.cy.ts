it("should load the page", () => {
  cy.visit(`/`);
});

it("should load the page with seed info available", () => {
  cy.visit(`/?seed=${123}`);
});
