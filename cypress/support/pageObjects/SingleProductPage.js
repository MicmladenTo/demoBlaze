class SingleProductPage {

	// Getters and setters

	getAddToCartButton() {
		return cy.get('.btn-success');
	}

	getProductName() {
		return cy.get('.name');
	}

	getAllProductsInCart() {
		return cy.get('.success :nth-child(2)');
	}

	getPlaceOrderButton() {
		return cy.get('.btn-success');
	}

	getAllPrices() {
		return cy.get('.success :nth-child(3)');
	}

	getTotalSum() {
		return cy.get('#totalp');
	}

	getPlaceOrderName() {
		return cy.get('#name');
	}

	getPlaceOrderCountry() {
		return cy.get('#country');
	}

	getPlaceOrderCity() {
		return cy.get('#city');
	}

	getPlaceOrderCard() {
		return cy.get('#card');
	}

	getPlaceOrderMonth() {
		return cy.get('#month');
	}

	getPlaceOrderYear() {
		return cy.get('#year');
	}

	getPlaceOrderPurchase() {
		return cy.get('#orderModal .btn-primary')
	}

	getOrderInfo() {
		return cy.get('.lead');
	}


	// Alerts

	// productAddedAlert() {
	// 	cy.on('window:alert', (str) => {
	// 		expect(str).to.equal('Product added');
	// 	})
	// }

	nameAndCardAlert() {
		cy.on('window:alert', (n) => {
			expect(n).to.equal('Please fill out Name and Creditcard.');
		})
	}

	// Functions

	addAssertAndReturn(productName) {
		this.getAddToCartButton().should('be.visible');
		this.getProductName().should('contain.text', productName);
		this.getAddToCartButton().click();
		cy.wait('@postAddToCart').its('response.statusCode',).should('eq', 200)
		//this.productAddedAlert();
		cy.visit(Cypress.env('url'));
	}

	fillInTheForm(name, country, city, card, month, year) {
		cy.wait(500);
		this.getPlaceOrderName().type(name).should('contain.value', name);
		this.getPlaceOrderCountry().type(country).should('contain.value', country);;
		this.getPlaceOrderCity().type(city).should('contain.value', city);;
		this.getPlaceOrderCard().type(card).should('contain.value', card);;
		this.getPlaceOrderMonth().type(month).should('contain.value', month);;
		this.getPlaceOrderYear().type(year).should('contain.value', year);;
	}


}

export default SingleProductPage;