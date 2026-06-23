/// <reference types="cypress" />

describe('Login', () => {
  let users

  before(() => {
    cy.fixture('users').then((data) => {
      users = data
    })
  })

  beforeEach(() => {
    cy.visitFresh('/')
  })

  it('logs in successfully with standard_user', () => {
    cy.get('[data-test="username"]').type(users.standard)
    cy.get('[data-test="password"]').type(users.password)
    cy.get('[data-test="login-button"]').click()

    cy.url().should('include', '/inventory.html')
    cy.get('[data-test="title"]').should('have.text', 'Products')
  })

  it('blocks the locked_out_user with an error message', () => {
    cy.get('[data-test="username"]').type(users.lockedOut)
    cy.get('[data-test="password"]').type(users.password)
    cy.get('[data-test="login-button"]').click()

    cy.url().should('not.include', '/inventory.html')
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Sorry, this user has been locked out')
  })

  it('rejects an invalid password', () => {
    cy.get('[data-test="username"]').type(users.standard)
    cy.get('[data-test="password"]').type('wrong_password')
    cy.get('[data-test="login-button"]').click()

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Username and password do not match')
  })

  it('requires a username', () => {
    cy.get('[data-test="password"]').type(users.password)
    cy.get('[data-test="login-button"]').click()

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Username is required')
  })

  it('requires a password', () => {
    cy.get('[data-test="username"]').type(users.standard)
    cy.get('[data-test="login-button"]').click()

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'Password is required')
  })
})
