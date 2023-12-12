/// <reference types="cypress" />
import '@applitools/eyes-cypress/commands';


Cypress.eyesOpen('financeapplication', 'Login Tests');

describe('UserLogin', () => {
  beforeEach(() => {
    cy.visit('/signin'); 
  });

  it('should UserLogin successfully (E2E)', () => {
    cy.get('[data-testid=username-input]').type('your_username'); 
    cy.get('[data-testid=password-input]').type('your_password'); 
    cy.get('[data-testid=login-button]').click(); 

    cy.url().should('include', '/dashboard'); 

    cy.eyesCheckWindow('Successful Login');
  });

  it('should display login failure message (E2E)', () => {
    cy.get('[data-testid=username-input]').type('invalid_username'); 
    cy.get('[data-testid=password-input]').type('invalid_password'); 
    cy.get('[data-testid=login-button]').click(); 

    cy.get('.login-modal').should('be.visible');
    cy.get('.login-modal h2').should('contain.text', 'Login failed');


    cy.eyesCheckWindow('Login Failure');
  });

  it('should look correct (Visual Regression)', () => {

    cy.eyesCheckWindow('Login Page');
  });
});


Cypress.eyesClose();
