/// <reference types="cypress" />
import 'cypress-eyes';

describe('PersonalDash', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  // E2E: Test navigating to Budget List and adding a budget
  it('should navigate to Budget List and add a budget', () => {
    cy.get('.dashboard-buttons button').contains('View Financial Records').click();

    cy.url().should('include', '/budget-list');

    cy.get('.dashboard-buttons button').contains('Add New Expense').click();

    cy.get('.add-budget-component select#selectedMonth').select('1');
    cy.get('.add-budget-component input#budgetName').type('Test Budget');
    cy.get('.add-budget-component input#budgetNumber').type('1000');
    cy.get('.add-budget-component button.add-budget-button').click();

    cy.get('.modal h2').should('contain', 'Budget added successfully');
  });

  it('should log out successfully', () => {
    cy.get('.logout-button').click();

    cy.url().should('include', '/userlogin');
  });

  // Visual Regression: Test for matching the PersonalDash component snapshot
  it('should match the PersonalDash component snapshot', () => {
    cy.eyesOpen({
      appName: 'financeapplication',
      testName: 'PersonalDash Component Snapshot',
    });

    cy.eyesCheckWindow('PersonalDash Component');

    cy.eyesClose();
  });
});
