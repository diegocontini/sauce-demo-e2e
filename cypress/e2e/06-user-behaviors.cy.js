/// <reference types="cypress" />

// SauceDemo ships several "special" accounts that intentionally behave
// differently. These tests document and assert those behaviours.
describe('Special user behaviours', () => {
  let users

  before(() => {
    cy.fixture('users').then((data) => {
      users = data
    })
  })

  it('performance_glitch_user logs in despite the slow response', () => {
    cy.login(users.performanceGlitch)
    // The page is artificially slow; the default 10s timeout absorbs it.
    cy.url().should('include', '/inventory.html')
    cy.get('[data-test="inventory-item"]').should('have.length', 6)
  })

  it('problem_user logs in but renders every product with the same image', () => {
    cy.login(users.problem)
    cy.url().should('include', '/inventory.html')

    cy.get('.inventory_item_img img').then(($imgs) => {
      const sources = [...$imgs].map((img) => img.getAttribute('src'))
      const unique = new Set(sources)
      // Known bug: all six products share one (broken) image.
      expect(unique.size, 'distinct product images').to.equal(1)
    })
  })

  it('error_user can log in and add a product to the cart', () => {
    cy.login(users.error)
    cy.url().should('include', '/inventory.html')
    cy.addProductToCart('Sauce Labs Backpack')
    cy.get('[data-test="shopping-cart-badge"]').should('have.text', '1')
  })

  it('visual_user can log in and see all products', () => {
    cy.login(users.visual)
    cy.url().should('include', '/inventory.html')
    cy.get('[data-test="inventory-item"]').should('have.length', 6)
  })
})
