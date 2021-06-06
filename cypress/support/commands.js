// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

import SingleProductPage from "./pageObjects/SingleProductPage";

//
Cypress.Commands.add("selectProduct", (productName) => {

	cy.get('h4.card-title').each(($el, index, $list) => {
		if ($el.text().includes(productName)) {
			cy.get('.card-title .hrefch').eq(index).click();
		}
	})

})

Cypress.Commands.add("deleteProduct", (productName) => {

	cy.get('.success :nth-child(2)').each(($el, index, $list) => {
		if ($el.text().includes(productName)) {
			cy.get('.success :nth-child(4) a').eq(index).click();
		}
	})

})


Cypress.Commands.add("verifyPrices", () => {
	var sum = 0;
	cy.get('.success :nth-child(3)').each(($el, index, $list) => {
		const num = Number($el.text());
		sum = sum + num;
		console.log(sum);
	}).then(function() {
		cy.get('#totalp').then(function(element) {
			const amount = element.text();
			const filename = 'cypress/fixtures/shopData.json';

			// Assert that the prices match with the total
			expect(Number(amount)).to.equal(sum);

			// Store the value in JSON
			cy.readFile(filename).then((shopData) => {
				shopData.totalAmount = amount;
				cy.writeFile(filename, shopData)
			})
	
			cy.readFile(filename).then((shopData) => {
				expect(shopData.totalAmount).to.equal(amount) // true
			})
	})
})
	})
	

	// var sum = 0;
	// var totalSum = 0;
	// prices.each(($el, index, $list) => {
	// 	var res = $el; 
	// 	sum = Number(sum) + Number(res);
	// }).then(function() {
	// 	totalSum = singleProductPage.getTotalSum();
	// 	expect(Number(totalSum)).to.equal(sum);
	// })

	// Verify that the stacked up prices match with the total sum
	// singleProductPage.getTotalSum().then(function(element) {
	// 		let totalSum = element;
	// 		var res = amount.split(" ");
	// 		var total = res[1].trim();
	// 		expect(Number(total)).to.equal(sum);
	// })


//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... }
