/// <reference types="cypress" />
import 'cypress-eyes';

describe('BudgetCapacityManager', () => {
  // E2E: Test adding budget capacity
  it('should add budget capacity', () => {
    cy.visit('/settings');
    
    cy.get('.add-budget-box select#selectedMonth').select('1');
    cy.get('.add-budget-box input#budgetName').type('Test Budget');
    cy.get('.add-budget-box input#budgetNumber').type('1000');
    cy.get('.add-budget-box button.add-budget-button').click();
    
   
    cy.get('.capacity-data-box table tbody tr')
      .should('have.length', 1)
      .find('td')
      .should('have.length', 3) 
      .eq(0) 
      .should('contain', 'Test Budget');
  });
  

  
  // Visual Regression: Test for matching the AddBudgetCapacity component snapshot
  it('should match the BudgetCapacityManager component snapshot', () => {
    cy.visit('/settings');
  
    cy.eyesOpen({
      appName: 'financeapplication',
      testName: 'BudgetCapacityManager Component Snapshot',
    });
  
    cy.eyesCheckWindow({
      sizeMode: 'viewport',
      tag: 'BudgetCapacityManager',
      target: 'window',
    });
  
    cy.eyesClose();
  });
  
