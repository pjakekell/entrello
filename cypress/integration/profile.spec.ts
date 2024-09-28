/// <reference types="cypress" />
import "../support/index";

describe("User Profile", () => {
  beforeEach(() => {
    cy.login("org040120@email.com", "org040120");
  });

  it("should allow user to change language", () => {
    cy.visit("http://localhost:4230/profile");
    cy.get("#language").select("German");
    cy.get("button").contains("Save").click();
    cy.contains("Hilfe");
    cy.get("#language").select("English");
    cy.get("button").contains("Speichern").click();
    cy.contains("Help");
  });
});
