/// <reference types="cypress" />

describe('Checkout', () => {
  beforeEach(() => {
    cy.loginAsStandard()
    cy.addProductToCart('Sauce Labs Backpack')
    cy.addProductToCart('Sauce Labs Bike Light')
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('[data-test="checkout"]').click()
  })

  it('completes the full purchase flow', () => {
    cy.get('[data-test="firstName"]').type('John')
    cy.get('[data-test="lastName"]').type('Doe')
    cy.get('[data-test="postalCode"]').type('80000-000')
    cy.get('[data-test="continue"]').click()

    cy.url().should('include', '/checkout-step-two.html')
    cy.get('[data-test="inventory-item"]').should('have.length', 2)
    cy.get('[data-test="payment-info-value"]').should('be.visible')
    cy.get('[data-test="shipping-info-value"]').should('be.visible')
    cy.get('[data-test="total-label"]').should('contain', 'Total')

    cy.get('[data-test="finish"]').click()
    cy.url().should('include', '/checkout-complete.html')
    cy.get('[data-test="complete-header"]')
      .should('be.visible')
      .and('contain', 'Thank you for your order')
  })

  it('calculates the item total as the sum of the products', () => {
    cy.get('[data-test="firstName"]').type('John')
    cy.get('[data-test="lastName"]').type('Doe')
    cy.get('[data-test="postalCode"]').type('80000-000')
    cy.get('[data-test="continue"]').click()

    cy.get('[data-test="inventory-item-price"]').then(($prices) => {
      const sum = [...$prices].reduce(
        (acc, el) => acc + parseFloat(el.innerText.replace('$', '')),
        0
      )
      cy.get('[data-test="subtotal-label"]')
        .invoke('text')
        .then((text) => {
          const subtotal = parseFloat(text.replace(/[^0-9.]/g, ''))
          expect(subtotal).to.be.closeTo(sum, 0.001)
        })
    })
  })

  it('requires the first name', () => {
    cy.get('[data-test="lastName"]').type('Doe')
    cy.get('[data-test="postalCode"]').type('80000-000')
    cy.get('[data-test="continue"]').click()
    cy.get('[data-test="error"]').should('contain', 'First Name is required')
  })

  it('requires the postal code', () => {
    cy.get('[data-test="firstName"]').type('John')
    cy.get('[data-test="lastName"]').type('Doe')
    cy.get('[data-test="continue"]').click()
    cy.get('[data-test="error"]').should('contain', 'Postal Code is required')
  })

  it('can cancel the checkout and return to the cart', () => {
    cy.get('[data-test="cancel"]').click()
    cy.url().should('include', '/cart.html')
  })
})
