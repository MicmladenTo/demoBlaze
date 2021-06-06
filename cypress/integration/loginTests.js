/// <reference types="Cypress" />

import IndexPage from '../support/pageObjects/IndexPage';

describe('Signup tests', function () {

	beforeEach(function () {

		// Declare JSON data to be used for each test
		cy.fixture('shopData').then(function (data) {
			this.data = data;
		})

		// Assert expected status code upon page load
		cy.visit(Cypress.env('url')).request(Cypress.env('url')).should((response) => {
			expect(response.status).to.eq(200)
		})

		// Intercept the routes
		cy.intercept('GET','https://api.demoblaze.com/login').as('getLoginInfo');
		cy.intercept('POST','https://api.demoblaze.com/login').as('postLoginInfo');
		cy.intercept('POST','https://api.demoblaze.com/check').as('postLoginSuccess');
	})

	// Attempt logging in without entering the user name
	it('No username login attempt', function () {
		const indexPage = new IndexPage();

		// Open the modal
		indexPage.getModalLoginButton().should('be.visible').click();
		
		// Fill in the form and submit it
		indexPage.getLoginPassword().type(this.data.validPassword);
		indexPage.getLoginButton().click();

		// Assert the error message
		indexPage.invalidLoginAttemptError();
	})

	// Attempt logging in without entering a password
	it('No password login attempt', function () {
		const indexPage = new IndexPage();

		// Open the modal
		indexPage.getModalLoginButton().should('be.visible').click();

		// Fill in the form and submit it
		indexPage.getLoginUsername().type(this.data.randomUsername);
		indexPage.getLoginButton().click();

		// Assert the error message
		indexPage.invalidLoginAttemptError();
	})
	
	// // Attempt logging in with a non-registered username
	it('Invalid username login attempt', function () {
		const indexPage = new IndexPage();
		let invalidName = indexPage.getRandomName();
		let password = this.data.validPassword;

		// Fill in the form and submit it
		indexPage.logIn(invalidName, password);
		indexPage.getLoginButton().click();
		
		// Verify the error message in the response body
		cy.wait('@postLoginInfo').its('response.body.errorMessage').should('eq', 'User does not exist.');
		//cy.wait('@postLoginInfo').its('response.statusCode',).should('eq', 200)
		
		// Verify the frontend eror message
		indexPage.userDoesNotExistError();
	})

	// Attempt to log in with an invalid password
	it('Invalid password login attempt', function () {
		const indexPage = new IndexPage();
		let invalidPass = indexPage.getRandomName();
		let existingUsername = this.data.validName;

		// Submit the login form with a valid user and an invalid password
		indexPage.logIn(existingUsername, invalidPass);
		indexPage.getLoginButton().click();

		// Assert the error message in the backend response
		cy.wait('@postLoginInfo').its('response.body.errorMessage').should('eq', 'Wrong password.');

		// Assert the frontend error message
		indexPage.wrongPasswordError();
	})

	// Attempt to log in without credentials
	it('No credentials login attempt', function () {
		const indexPage = new IndexPage();

		// Get the log in modal
		indexPage.getModalLoginButton().should('be.visible').click();

		// Click on the input fields (just in case) and submit the form
		indexPage.getLoginUsername().click();
		indexPage.getLoginPassword().click();
		indexPage.getLoginButton().click();

		// Assert the alert message
		indexPage.invalidLoginAttemptError();
	})


	// Log in successfully
	it('Successful login', function () {
		const indexPage = new IndexPage();
		let username = this.data.validName;
		let password = this.data.validPassword;

		// Fill in the log in form with a registered username and password
		indexPage.logIn(username, password);

		// Submit the form
		indexPage.getLoginButton().click({force: true});

		// Verify that the request has been successfully posted
		cy.wait('@postLoginInfo').its('response.statusCode',).should('eq', 200)
		
		// Verify that the backend credentials passed to backend contain the username
		cy.wait('@postLoginSuccess').its('response.body.Item.username').should('contain', username);
		cy.wait(500);

		// Verify that the user is logged in
		indexPage.getUsernameField().should('contain.text', username);
	})
})