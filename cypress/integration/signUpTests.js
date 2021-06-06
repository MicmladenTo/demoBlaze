/// <reference types="Cypress" />

import IndexPage from '../support/pageObjects/IndexPage';

describe('Signup tests', function () {

	beforeEach(function () {
		// Declare JSON data to be used in tests
		cy.fixture('shopData').then(function (data) {
			this.data = data;
		})

		// Assert expected status code upon page load
		cy.visit(Cypress.env('url')).request(Cypress.env('url')).should((response) => {
			expect(response.status).to.eq(200)
		})

		// Intercept the routes
		cy.intercept('GET', 'https://api.demoblaze.com/signup').as('getSignupInfo');
		cy.intercept('POST', 'https://api.demoblaze.com/signup').as('postSignupInfo');
	})


// Attempt to sign up without a username
it('No username signup attempt', function () {
	const indexPage = new IndexPage();

	// Submit the form without a username and assert the frontend error message
	indexPage.noUsernameAttempt(this.data.validPassword);
})

// Attempt to sign up without a password
it('No password signup attempt', function () {
	const indexPage = new IndexPage();

	// Submit the form without a password and assert the frontend error message
	indexPage.noPasswordAttempt(this.data.validUsername);
})

// Sign up successfully with a random name
it('Successful signup', function () {
	const indexPage = new IndexPage();

	// Successfully submit the signup form and validate the frontend message and the response body
	// Set a valid registered username for login test suite!
	indexPage.fillInTheForm(indexPage.getValidName(), this.data.validPassword);
})

// Attempt to sign up up with an already existing username
it('Signup with existing name', function () {
const indexPage = new IndexPage();

// Fill in the signup form with existing user info and assert backend and frontend error messages
indexPage.existingAccountSignup(this.data.randomUsername, this.data.validPassword);
})

})