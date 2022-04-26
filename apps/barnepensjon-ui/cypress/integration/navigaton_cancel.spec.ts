import { basePath, Button } from '../util/constants'

describe('Navigation: "Cancel" button functionality', () => {
    beforeEach(() => {
        cy.startApplication('user').agreeToTerms().useScenario('PARENT')

        cy.clickBtn(Button.Cancel)

        cy.get('#avbryt-nei-btn').should('be.visible')
        cy.get('#avbryt-ja-btn').should('be.visible')
        cy.get('#slett-soeknad').should('be.visible')
    })

    it('Should resume application when clicking No', () => {
        cy.get('#avbryt-nei-btn').click()

        cy.get('#avbryt-nei-btn').should('not.exist')
    })

    it('Should redirect to nav.no when clicking Yes, continue later', () => {
        cy.get('#avbryt-ja-btn').click()

        cy.url().should('include', 'https://www.nav.no/')
    })

    it('Should delete application and redirect to nav.no when clicking Yes, delete application', () => {
        cy.intercept('DELETE', `${basePath}/api/api/kladd`, {}).as('deleteApplication')

        cy.get('#slett-soeknad').click()
        cy.wait('@deleteApplication')

        cy.url().should('include', 'https://www.nav.no/')
    })
})