// Loaded automatically before every spec file.
import './commands'
import 'cypress-mochawesome-reporter/register'

// SauceDemo registers a service worker that caches the pages it serves. After a
// few in-suite navigations the cached responses stop firing the `load` event
// Cypress waits for, producing intermittent `timedOutWaitingForPageLoad`
// errors. Removing the service worker API before each page loads keeps every
// navigation a real network request with a reliable load event.
Cypress.on('window:before:load', (win) => {
  try {
    delete win.navigator.__proto__.serviceWorker
  } catch (e) {
    // navigator.serviceWorker is non-configurable in some browsers; ignore.
  }
})
