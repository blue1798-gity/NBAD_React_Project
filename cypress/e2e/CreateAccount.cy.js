/// <reference types="cypress" />
import '@applitools/eyes-cypress/commands';


Cypress.eyesOpen({
  appName: 'financeapplication',
  testName: 'UserRegistration Page Snapshot',
});

describe('UserRegistration', () => {
  beforeEach(() => {
    cy.visit('/signup'); 
  });

  it('should successfully sign up a user (E2E)', () => {
    cy.get('.signup-input[name="User\'s Full Name:"]').type('John Doe'); 
    cy.get('.signup-input[name="Username:"]').type('john.doe'); 
    cy.get('.signup-input[name="Pass code:"]').type('securePassword');

    cy.get('.signup-button').click();

    cy.get('.dialog.success').should('be.visible');
  });

  it('should handle UserRegistration failure (E2E)', () => {
    cy.get('.signup-input[name="User\'s Full Name:"]').type('Invalid User'); 
    cy.get('.signup-input[name="Username:"]').type('invalid.user'); 
    cy.get('.signup-input[name="Pass code:"]').type('weakPassword'); 

    cy.get('.signup-button').click();

    cy.get('.dialog.error').should('be.visible');
  });

  it('should match the signup page snapshot (Visual Regression)', () => {
    cy.eyesCheckWindow('UserRegistration Page');
  });
});


Cypress.eyesClose();
