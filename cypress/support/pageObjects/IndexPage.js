class IndexPage {

	// Getters and setters

	getSignupModalButton() {
		return cy.get('#signin2');
	}

	getModalLoginButton() {
		return cy.get('#login2');
	}

	getUsernameInput() {
		return cy.get('#sign-username');
	}

	getPasswordInput() {
		return cy.get('#sign-password');
	}

	getSignupButton() {
		return cy.get('#signInModal .btn-primary');
	}

	getCloseButton() {
		return cy.get('#signInModal .close')
	}

	getRandomName() {
		return this.setRandomName();
	}

	getValidName() {
		return this.setValidName();
	}

	getLoginUsername() {
		return cy.get('#loginusername');
	}

	getLoginPassword() {
		return cy.get('#loginpassword');
	}

	getLoginButton() {
		return cy.get('#logInModal .btn-primary')
	}

	getUsernameField() {
		return cy.get('#nameofuser');
	}

	getLaptopsButton() {
		return cy.get('[onclick="byCat(\'notebook\')"]');
	}

	getMonitorsButton() {
		return cy.get('[onclick="byCat(\'monitor\')"]');
	}

	getCartButton() {
		return cy.get('#cartur');
	}

	getproductNames() {
		return cy.get('.card-title .hrefch');
	}

	setRandomName() {
		let randomName = Date.now() + Math.random();
		const filename = 'cypress/fixtures/shopData.json';


		cy.readFile(filename).then((signupData) => {
			signupData.randomUsername = randomName;
			cy.writeFile(filename, signupData)
		})

		cy.readFile(filename).then((user) => {
			expect(user.randomUsername).to.equal(randomName) // true
		})
		return randomName
	}

	setValidName() {
		let createdUser = Date.now() + Math.random();
		const filename = 'cypress/fixtures/shopData.json';


		cy.readFile(filename).then((signupData) => {
			signupData.validName = createdUser;
			cy.writeFile(filename, signupData)
		})

		cy.readFile(filename).then((user) => {
			expect(user.validName).to.equal(createdUser) // true
		})
		return createdUser;
	}

	noUsernameAttempt(password) {
		this.getSignupModalButton().click();
		this.getUsernameInput().should('be.visible');
		this.getPasswordInput().type(password);
		this.getSignupButton().click();
		this.assertErrorMessage();
		this.getPasswordInput().clear();
		this.getCloseButton().click();
	}

	noPasswordAttempt(username) {
		this.getSignupModalButton().click();
		this.getUsernameInput().should('be.visible');
		this.getUsernameInput().type(username);
		this.getPasswordInput().click();
		this.getSignupButton().click();
		this.assertErrorMessage();
		this.getUsernameInput().clear();
		this.getCloseButton().click();
	}

	fillInTheForm(username, password) {
		this.getSignupModalButton().click();
		this.getUsernameInput().should('be.visible');
		cy.wait(500);
		this.getUsernameInput().type(username);
		this.getPasswordInput().type(password);
		this.getSignupButton().click();
		cy.wait('@postSignupInfo').its('response.body').should('be.empty');
		cy.wait(500);
		this.assertSuccessfulSignup();
		this.getModalLoginButton().should('be.visible');
	}

	existingAccountSignup(username, password) {
		this.getSignupModalButton().should('be.visible').click();
		this.getUsernameInput().should('be.visible');
		cy.wait(500);
		this.getUsernameInput().type(username);
		this.getPasswordInput().type(password);
		this.getSignupButton().click();
		cy.wait('@postSignupInfo').its('response.body.errorMessage').should('contain', 'This user already exist.');
		this.existingAccountError();
		this.getCloseButton().click();
	}

	logIn(username, password) {
		this.getModalLoginButton().should('be.visible').click();
		this.getLoginUsername().should('be.visible');
		cy.wait(500);
		this.getLoginUsername().type(username).should('have.value', username);
		this.getLoginPassword().type(password).should('have.value', password);
	}



	// Assertations

	assertErrorMessage() {
		cy.on('window:alert', (str) => {
			expect(str).to.equal('Please fill out Username and Password.');
		})
	}


	assertSuccessfulSignup() {
		cy.on('window:alert', (str) => {
			expect(str).to.equal('Sign up successful.');
		})
	}

	existingAccountError() {
		cy.on('window:alert', (str) => {
			expect(str).to.equal('This user already exist.');
		})
	}

	invalidLoginAttemptError() {
		cy.on('window:alert', (str) => {
			expect(str).to.equal('Please fill out Username and Password.');
		})
	}

	userDoesNotExistError() {
		cy.on('window:alert', (str) => {
			expect(str).to.equal('User does not exist.');
		})
	}

	wrongPasswordError() {
		cy.on('window:alert', (str) => {
			expect(str).to.equal('Wrong password.');
		})
	}

}

export default IndexPage;