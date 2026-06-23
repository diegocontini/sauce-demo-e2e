// Custom Cypress commands shared across specs.

const PASSWORD = 'secret_sauce'

/**
 * Visit a page with a cache-busting query param.
 *
 * SauceDemo serves the login page from disk cache after a prior in-suite
 * navigation, and the cached response does not always fire the `load` event
 * Cypress waits for, causing a `timedOutWaitingForPageLoad`. A unique query
 * string forces a fresh response and a reliable load event.
 * @param {string} [path]
 */
Cypress.Commands.add('visitFresh', (path = '/') => {
  const sep = path.includes('?') ? '&' : '?'
  cy.visit(`${path}${sep}cb=${Date.now()}`)
})

/**
 * Fill the login form and submit.
 * @param {string} username
 * @param {string} [password] defaults to the shared SauceDemo password.
 */
Cypress.Commands.add('login', (username, password = PASSWORD) => {
  cy.visitFresh('/')
  cy.get('[data-test="username"]').clear().type(username)
  if (password) {
    cy.get('[data-test="password"]').clear().type(password, { log: false })
  }
  cy.get('[data-test="login-button"]').click()
})

/**
 * Log in as standard_user and assert we landed on the inventory page.
 */
Cypress.Commands.add('loginAsStandard', () => {
  cy.login('standard_user')
  cy.url().should('include', '/inventory.html')
})

/**
 * Add a single product to the cart by its visible name.
 * @param {string} productName
 */
Cypress.Commands.add('addProductToCart', (productName) => {
  cy.contains('[data-test="inventory-item"]', productName)
    .find('button')
    .click()
})

/**
 * Read the cart badge count, returning 0 when the badge is absent.
 */
Cypress.Commands.add('cartCount', () => {
  return cy.get('body').then(($body) => {
    const badge = $body.find('[data-test="shopping-cart-badge"]')
    return badge.length ? Number(badge.text()) : 0
  })
})
