import { Button } from '../util/constants'

describe('About The Deceased', () => {
    before(() => {
        cy.startApplication('user').agreeToTerms().useScenario('PARENT').acceptInformationAboutYou()

        cy.url().should('include', 'skjema/forelder/steg/om-avdoede')
    })

    it('Should request information about the deceased', function () {
        // todo: Test more scenarios and stays abroad
        cy.useSimpleDeceased(false)

        cy.clickBtn(Button.Save)

        cy.url().should('include', 'skjema/forelder/steg/om-barn')
    })
})