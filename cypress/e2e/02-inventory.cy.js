/// <reference types="cypress" />

describe('Inventory / Products', () => {
  beforeEach(() => {
    cy.loginAsStandard()
  })

  it('displays all 6 products with name, price and image', () => {
    cy.get('[data-test="inventory-item"]').should('have.length', 6)
    cy.get('[data-test="inventory-item-name"]').first().should('not.be.empty')
    cy.get('[data-test="inventory-item-price"]').first().should('contain', '$')
    cy.get('.inventory_item_img img').should('have.length', 6)
  })

  it('opens a product detail page from the product name', () => {
    cy.get('[data-test="inventory-item-name"]').first().then(($name) => {
      const name = $name.text()
      cy.wrap($name).click()
      cy.url().should('include', '/inventory-item.html')
      cy.get('[data-test="inventory-item-name"]').should('have.text', name)
      cy.get('[data-test="back-to-products"]').should('be.visible')
    })
  })

  it('sorts products by name Z to A', () => {
    cy.get('[data-test="product-sort-container"]').select('za')
    cy.get('[data-test="inventory-item-name"]').then(($names) => {
      const names = [...$names].map((el) => el.innerText)
      const sorted = [...names].sort().reverse()
      expect(names).to.deep.equal(sorted)
    })
  })

  it('sorts products by price low to high', () => {
    cy.get('[data-test="product-sort-container"]').select('lohi')
    cy.get('[data-test="inventory-item-price"]').then(($prices) => {
      const prices = [...$prices].map((el) => parseFloat(el.innerText.replace('$', '')))
      const sorted = [...prices].sort((a, b) => a - b)
      expect(prices).to.deep.equal(sorted)
    })
  })

  it('sorts products by price high to low', () => {
    cy.get('[data-test="product-sort-container"]').select('hilo')
    cy.get('[data-test="inventory-item-price"]').then(($prices) => {
      const prices = [...$prices].map((el) => parseFloat(el.innerText.replace('$', '')))
      const sorted = [...prices].sort((a, b) => b - a)
      expect(prices).to.deep.equal(sorted)
    })
  })
})
