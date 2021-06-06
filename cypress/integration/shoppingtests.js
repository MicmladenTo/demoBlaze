/// <reference types="Cypress" />

import IndexPage from '../support/pageObjects/IndexPage';
import SingleProductPage from '../support/pageObjects/SingleProductPage'

describe('Signup tests', function() {

	// Declare JSON data to be used for each test
	beforeEach(function() {
		cy.fixture('shopData').then(function(data) {
			this.data = data;
		})
	

	// Assert expected status code upon page load
	cy.visit(Cypress.env('url')).request(Cypress.env('url')).should((response) => {
		expect(response.status).to.eq(200)
	})

	// Intercept the routes
	cy.intercept('POST','https://api.demoblaze.com/view').as('postView');
	cy.intercept('POST','https://api.demoblaze.com/addtocart').as('postAddToCart');
	cy.intercept('POST','https://api.demoblaze.com/viewcart').as('postViewCart');
	cy.intercept('POST','https://api.demoblaze.com/bycat').as('postByCat');
	cy.intercept('POST','https://api.demoblaze.com/deleteitem').as('deleteItem');
	cy.intercept('POST','https://api.demoblaze.com/deletecart').as('deleteCart');
	cy.intercept('GET','https://hls.demoblaze.com/index.m3u8').as('getIndex');
	cy.intercept('GET','https://hls.demoblaze.com/entries').as('getEntries');
	
	

})

/*
	it('Shopping, happy path', function() {
		const indexPage = new IndexPage();
		const singleProductPage = new SingleProductPage();
		const desiredProducts = this.data.productName;
		const userData = this.data.userData;
		const productAssertation = this.data.productAssertation;

		cy.visit(Cypress.env('url'));

		// Select products based on their name using commands
		cy.selectProduct(desiredProducts[0]);

		// Verify that the response body contains the product name
		cy.wait('@postView').its('response.body.desc').should('include', productAssertation[0]);
		cy.wait('@getIndex').its('response.statusCode',).should('eq', 200)

		// Add to cart and verify the successful status code of the post request
		singleProductPage.addAssertAndReturn(desiredProducts[0])
		
		// Go to the laptop section and assert the request
		indexPage.getLaptopsButton().click()
		cy.wait('@postByCat').its('request.body.cat').should('include', 'notebook');

		// Select the second product based on their name using commands
		cy.selectProduct(desiredProducts[1]);

		// Verify that the response body contains the product name
		cy.wait('@postView').its('response.body.desc').should('include', productAssertation[1]);
		cy.wait('@getIndex').its('response.statusCode',).should('eq', 200)

		// Add to cart and verify the successful status code of the post request
		singleProductPage.addAssertAndReturn(desiredProducts[1]);

		// Select the third product based on their name using commands
		cy.selectProduct(desiredProducts[2]);

		// Verify that the response body contains the product name
		cy.wait('@postView').its('response.body.desc').should('include', productAssertation[2]);
		cy.wait('@getIndex').its('response.statusCode',).should('eq', 200)

		// Add to cart and verify the successful status code of the post request
		singleProductPage.addAssertAndReturn(desiredProducts[2]);

		// Go to cart
		indexPage.getCartButton().click();

		// Assert the number of items in the cart - backend
		cy.wait('@postViewCart').its('response.body.Items',).should('have.length', 3)

		// Assert the number of items in the cart - frontend
		singleProductPage.getAllProductsInCart().should('have.length', 3);

		// Delete an item and assert the request
		cy.deleteProduct(desiredProducts[1]);
		cy.wait('@deleteItem').its('response.body',).should('include', "Item deleted");


		// Assert number of products in a cart frontend
		singleProductPage.getAllProductsInCart().should('have.length', 2);

		// Assert number of products in a cart backend
		cy.wait('@postViewCart').its('response.body.Items',).should('have.length', 2)

		// Verify prices
		cy.verifyPrices();

		// Place order
		singleProductPage.getPlaceOrderButton().click();

		// Fill in and assert the form
		singleProductPage.fillInTheForm(
			userData[0],
			userData[1],
			userData[2],
			userData[3],
			userData[4],
			userData[5]
		);

		// Confirm the purchase and assert the backend message
		singleProductPage.getPlaceOrderPurchase().click();
		cy.wait('@deleteCart').its('response.statusCode',).should('eq', 200)
		
		// Assert that order info is correct
		singleProductPage.getOrderInfo()
		.should('include.text', userData[0])
		.and('include.text', userData[3])
		.and('include.text', this.data.totalAmount);
	})
	*/
	
	it('Purchasing without entering credit card details', function() {
		const indexPage = new IndexPage();
		const singleProductPage = new SingleProductPage();
		const desiredProducts = this.data.productName;
		const userData = this.data.userData;
		const productAssertation = this.data.productAssertation;

		// Visit the website
		cy.visit(Cypress.env('url'));

		// Go to monitors section 
		indexPage.getMonitorsButton().click();

		// Assert the backend request, the total number of items and find the desired item
		cy.wait('@postByCat').its('request.body.cat').should('include', 'monitor');
		indexPage.getproductNames().should('include.text', desiredProducts[3]).then(function() {
			cy.get('.card-title .hrefch').should('have.length', 2);
		});

		// Click on the product
		cy.selectProduct(desiredProducts[3]);

		// Verify that the response body contains the product name
		cy.wait('@postView').its('response.body.desc').should('include', productAssertation[3]);
		cy.wait('@getIndex').its('response.statusCode',).should('eq', 200)

		// Add to cart and verify the successful status code of the post request
		singleProductPage.addAssertAndReturn(desiredProducts[3]);

		// Go to cart and assert the number of products
		indexPage.getCartButton().click();

		// Assert the number of items in the cart - backend
		cy.wait('@postViewCart').its('response.body.Items',).should('have.length', 1)

		// Assert the number of items in the cart - backend
		singleProductPage.getAllProductsInCart().should('have.length', 1);

		// Assert that the final price is matching
		cy.verifyPrices();

		// Place an order
		singleProductPage.getPlaceOrderButton().click()

		// Fill in the form
		singleProductPage.getPlaceOrderName().should('be.visible').then(function(){
			cy.wait(2000)
			singleProductPage.fillInTheForm(
				userData[0],
				userData[1],
				userData[2],
				userData[3],
				userData[4],
				userData[5]
				);
		}).then(function() {

		// Delete the credit card number and confirm the purchase
		singleProductPage.getPlaceOrderCard()
		.clear()
		.should('be.empty').then(function() {
			singleProductPage.getPlaceOrderPurchase().click();
		});
		
		singleProductPage.nameAndCardAlert();
	});

})
	

	it('Try purchasing all Samsung phones without entering a name', function() {
		const indexPage = new IndexPage();
		const singleProductPage = new SingleProductPage();
		const desiredProducts = this.data.productName;
		const userData = this.data.userData;
		const productAssertation = this.data.productAssertation;

		cy.visit(Cypress.env('url'));

		// Find the first Samsung phone
		// Select products based on their name using commands
		cy.selectProduct(desiredProducts[4]);

		// Verify that the response body contains the product name
		cy.wait('@postView').its('response.body.desc').should('include', productAssertation[4]);
		cy.wait('@getIndex').its('response.statusCode',).should('eq', 200)

		// Add to cart and verify the successful status code of the post request
		singleProductPage.addAssertAndReturn(desiredProducts[4]);

		// Find the other Samsung phone
		cy.get('.card-title .hrefch').then(function() {
			cy.selectProduct(desiredProducts[5]);

			// Verify that the response body contains the product name
			cy.wait('@postView').its('response.body.desc').should('include', productAssertation[5]);
			cy.wait('@getIndex').its('response.statusCode',).should('eq', 200)

			// Add to cart and verify the successful status code of the post request
			singleProductPage.addAssertAndReturn(desiredProducts[5]);
		})

		// Go to cart
		indexPage.getCartButton().click();

		// Assert the number of items in the cart - backend
		cy.wait('@postViewCart').its('response.body.Items',).should('have.length', 2)

		// Assert the number of items in the cart - frontend
		singleProductPage.getAllProductsInCart().should('have.length', 2);

		//Verify prices
		cy.verifyPrices();

		// Place the order
		singleProductPage.getPlaceOrderButton().click();

		// Fill in the order form
		singleProductPage.getPlaceOrderCard().
		should('be.visible').
		type(userData[3]).
		should('have.value', userData[3])

		// Click the purchase button
		singleProductPage.getPlaceOrderPurchase().click().then(function() {
			singleProductPage.nameAndCardAlert();
		});
		
	})
	
})