import * as CsvToJsonUtility from '../../src/shared/CsvToJsonUtility'
import { CSV_CONVERTED_TO_JSON } from '../resources/constants';

describe('Financial App', () => {
  beforeEach(() => {
    // logging in as user
    cy.visit(Cypress.env('frontend_url'));
    cy.get('.login-btn').click();
    cy.get('h1').contains('LoginPage');
    //inside login page
    cy.get('.username-input').type(Cypress.env('username'));
    cy.get('.password-input').type(Cypress.env('password'));
    cy.get('.login-start-btn').click();
    cy.get('h1').contains('Home Page');
  }) 

  it('should ingest bank provided csv for expenses', () => {
    cy.stub(CsvToJsonUtility, 'readFile').returns(CSV_CONVERTED_TO_JSON);
    cy.get('.ingest-edu-checking-btn').click();
    cy.get('input[type=file]').attachFile('checkings_demo_.csv');
  })
})