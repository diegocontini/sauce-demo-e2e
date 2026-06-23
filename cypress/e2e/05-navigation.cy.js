/// <reference types="cypress" />

describe('Navigation and menu', () => {
  beforeEach(() => {
    cy.loginAsStandard()
  })

  it('logs out through the burger menu', () => {
    cy.get('#react-burger-menu-btn').click()
    cy.get('[data-test="logout-sidebar-link"]').click()
    cy.url().should('eq', 'https://www.saucedemo.com/')
    cy.get('[data-test="login-button"]').should('be.visible')
  })

  it('resets the app state and clears the cart', () => {
    cy.addProductToCart('Sauce Labs Backpack')
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1')

    cy.get('#react-burger-menu-btn').click()
    cy.get('[data-test="reset-sidebar-link"]').click()
    cy.get('#react-burger-cross-btn').click()
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist')
  })

  it('exposes the All Items menu entry', () => {
    cy.get('#react-burger-menu-btn').click()
    cy.get('[data-test="inventory-sidebar-link"]').should('be.visible').click()
    cy.url().should('include', '/inventory.html')
  })

  it('blocks access to inventory without authentication', () => {
    cy.get('#react-burger-menu-btn').click()
    cy.get('[data-test="logout-sidebar-link"]').click()

    cy.visit('/inventory.html?cb=' + Date.now(), { failOnStatusCode: false })
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'You can only access')
    cy.url().should('not.include', '/inventory.html')
  })

  it('links out to social media in the footer', () => {
    cy.get('[data-test="social-twitter"]').should('have.attr', 'href').and('include', 'twitter.com')
    cy.get('[data-test="social-facebook"]').should('have.attr', 'href').and('include', 'facebook')
    cy.get('[data-test="social-linkedin"]').should('have.attr', 'href').and('include', 'linkedin')
  })
})
