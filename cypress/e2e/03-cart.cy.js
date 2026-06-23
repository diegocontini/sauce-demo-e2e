/// <reference types="cypress" />

describe('Shopping cart', () => {
  beforeEach(() => {
    cy.loginAsStandard()
  })

  it('adds a product and updates the cart badge', () => {
    cy.addProductToCart('Sauce Labs Backpack')
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1')
  })

  it('adds multiple products and reflects the count', () => {
    cy.addProductToCart('Sauce Labs Backpack')
    cy.addProductToCart('Sauce Labs Bike Light')
    cy.addProductToCart('Sauce Labs Bolt T-Shirt')
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '3')
  })

  it('removes a product from the inventory page', () => {
    cy.addProductToCart('Sauce Labs Backpack')
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1')

    cy.contains('[data-test="inventory-item"]', 'Sauce Labs Backpack')
      .find('button')
      .click()
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist')
  })

  it('lists added products on the cart page', () => {
    cy.addProductToCart('Sauce Labs Backpack')
    cy.addProductToCart('Sauce Labs Bike Light')

    cy.get('[data-test="shopping-cart-link"]').click()
    cy.url().should('include', '/cart.html')
    cy.get('[data-test="inventory-item"]').should('have.length', 2)
    cy.contains('[data-test="inventory-item"]', 'Sauce Labs Backpack').should('exist')
    cy.contains('[data-test="inventory-item"]', 'Sauce Labs Bike Light').should('exist')
  })

  it('removes a product from the cart page', () => {
    cy.addProductToCart('Sauce Labs Backpack')
    cy.get('[data-test="shopping-cart-link"]').click()

    cy.contains('[data-test="inventory-item"]', 'Sauce Labs Backpack')
      .find('button')
      .click()
    cy.get('[data-test="inventory-item"]').should('not.exist')
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist')
  })

  it('keeps shopping with the Continue Shopping button', () => {
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('[data-test="continue-shopping"]').click()
    cy.url().should('include', '/inventory.html')
  })
})
