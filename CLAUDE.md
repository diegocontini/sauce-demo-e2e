# CLAUDE.md

Guidance for AI assistants (and humans) working in this repository.

## What this is

End-to-end test suite for the public demo e-commerce site
**https://www.saucedemo.com**, built with **Cypress**. It is a university
assignment for the *Teste de Software* course (UTFPR). Code and identifiers are
in **English**; user-facing documentation (`README.md`, `RELATORIO.md`) is in
**pt-BR**.

## Commands

```bash
npm install        # install Cypress + reporter
npm run cy:open    # interactive Cypress runner (GUI)
npm run cy:run     # headless run of the whole suite
npx cypress run --spec cypress/e2e/01-login.cy.js   # single spec
```

A headless run regenerates the HTML report at `cypress/reports/index.html`.

## Layout

```
cypress.config.js              # baseUrl, viewport, mochawesome reporter
cypress/
  e2e/                         # specs, numbered by execution order
    01-login.cy.js             # login success/failure, field validation
    02-inventory.cy.js         # product listing, detail page, sorting
    03-cart.cy.js              # add/remove items, cart page, badge
    04-checkout.cy.js          # full purchase flow, totals, validation
    05-navigation.cy.js        # burger menu, logout, reset, auth guard
    06-user-behaviors.cy.js    # special accounts (problem/perf/error/visual)
  fixtures/users.json          # usernames + shared password
  support/
    commands.js                # custom commands
    e2e.js                     # global hooks (service-worker workaround)
  reports/index.html           # generated test report (gitignored)
```

## Test credentials

All accounts share the password `secret_sauce`. Usernames live in
`cypress/fixtures/users.json`: `standard_user`, `locked_out_user`,
`problem_user`, `performance_glitch_user`, `error_user`, `visual_user`.

## Custom commands (`cypress/support/commands.js`)

- `cy.login(username, password?)` — visit `/` and submit the login form.
- `cy.loginAsStandard()` — log in as `standard_user` and assert inventory page.
- `cy.visitFresh(path?)` — visit with a cache-busting query param.
- `cy.addProductToCart(productName)` — add a product by its visible name.
- `cy.cartCount()` — read the cart badge (0 when absent).

## Important gotcha: SauceDemo service worker

SauceDemo registers a service worker that caches served pages. After several
in-suite navigations the cached responses stop firing the `load` event Cypress
waits for, causing intermittent **`timedOutWaitingForPageLoad`** failures (the
first test of each spec passes, later ones hang ~60s and fail).

The fix lives in `cypress/support/e2e.js`: a global `window:before:load` hook
deletes `navigator.serviceWorker` before every page load, so each navigation is
a real network request. `cy.visitFresh` additionally appends a cache-busting
query param. **Do not remove these** or the suite becomes flaky and slow. With
the workaround the full suite runs in ~40s; without it, ~8min with failures.

## Conventions

- Prefer SauceDemo's `[data-test="..."]` selectors; they are stable.
- Each spec is self-contained: it logs in via a custom command in `beforeEach`.
- Default `testIsolation` is on, so cookies/storage reset between tests.
- Keep specs numbered to convey a logical reading/execution order.

## Commit conventions

- Commit messages in pt-BR, imperative mood.
- Do **not** add a Claude/AI co-author trailer.
