import mockSoeknad from '../../src/assets/dummy-soeknad.json'
import { IValg } from '../../src/typer/Spoersmaal'
import { a11yCheck, basePath, gaaTilNesteSide, getById, selectValue, selectValueForId } from '../util/cy-functions'

describe('Skal gå igjennom hele søknaden uten feil', () => {
    it('Skal åpne startsiden og starte en søknad', () => {
        cy.intercept('GET', `${basePath}/api/person/innlogget`, { fixture: 'testbruker' }).as('hentInnloggetPerson')
        cy.intercept('GET', `${basePath}/api/api/kladd`, {}).as('hentSoeknad') // Ingen kladd eksisterer
        cy.intercept('POST', `${basePath}/api/api/kladd`, {})
        const utloepDato = new Date()
        utloepDato.setHours(utloepDato.getHours() + 1)
        cy.intercept('GET', `${basePath}/session`, { body: utloepDato.getTime() })
        cy.visit('localhost:3000/omstillingsstonad/soknad', {
            onBeforeLoad: (obj) => {
                Object.defineProperty(obj.navigator, 'language', { value: 'nb-NO' })
            },
        })
        cy.injectAxe()
        cy.wait(['@hentInnloggetPerson'])
        cy.wait(['@hentSoeknad'])

        // Bekreft riktige opplysninger
        cy.get('[type="checkbox"]').check({ force: true })

        cy.checkA11y()

        // Start søknaden
        getById('start-soeknad').click()
    })

    it('Skal fylle ut siden "Om Deg" og gå til neste', () => {
        cy.url().should('include', 'steg/om-deg')

        // Verifiser felter og fyll ut skjema.
        const omDeg = mockSoeknad.omDeg
        cy.get('#alternativAdresse').should('not.exist')
        getById('kontaktinfo.telefonnummer').type(omDeg.kontaktinfo.telefonnummer)
        selectValueForId('oppholderSegINorge', omDeg.oppholderSegINorge)
        getById('utbetalingsInformasjon.kontonummer').type(omDeg.utbetalingsInformasjon.kontonummer)

        selectValue(omDeg.nySivilstatus.sivilstatus)

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om Deg og avdøde" og gå til neste', () => {
        cy.url().should('include', 'steg/om-deg-og-avdoed')

        // Verifiser felter og fyll ut skjema.
        const omDegOgAvdoed = mockSoeknad.omDegOgAvdoed
        getById('avdoed.fornavn').type(omDegOgAvdoed.avdoed.fornavn)
        getById('avdoed.etternavn').type(omDegOgAvdoed.avdoed.etternavn)
        getById('avdoed.datoForDoedsfallet').type(omDegOgAvdoed.avdoed.datoForDoedsfallet)
        selectValue(omDegOgAvdoed.forholdTilAvdoede.relasjon)
        getById('forholdTilAvdoede.datoForInngaattPartnerskap').type(
            omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap
        )

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om den avdøde" og gå til neste', () => {
        cy.url().should('include', 'steg/om-den-avdoede')
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'land.json' }).as('alleland')

        // Verifiser felter og fyll ut skjema.
        const omDenAvdoede = mockSoeknad.omDenAvdoede
        getById('foedselsnummer').type(omDenAvdoede.foedselsnummer)
        getById('statsborgerskap').find('select').select(omDenAvdoede.statsborgerskap)
        selectValueForId('boddEllerJobbetUtland.svar', omDenAvdoede.boddEllerJobbetUtland.svar)

        // Legg til land
        omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.map((oppholdUtland, idx) => {
            const baseId = `boddEllerJobbetUtland\.oppholdUtland\[${idx}\].`

            getById(baseId + 'land')
                .find('select')
                .select(oppholdUtland.land)
            oppholdUtland.beskrivelse.map((utlandType) => selectValue(utlandType)) // Bodd/Arbeidet checkbox
            getById(baseId + 'fraDato').type(oppholdUtland.fraDato)
            getById(baseId + 'tilDato').type(oppholdUtland.tilDato)
            selectValueForId(baseId + 'medlemFolketrygd', oppholdUtland.medlemFolketrygd)
            getById(baseId + 'mottokPensjon.beskrivelse').type(oppholdUtland.mottokPensjon.beskrivelse)
        })

        selectValueForId('selvstendigNaeringsdrivende.svar', omDenAvdoede.selvstendigNaeringsdrivende.svar)
        getById('selvstendigNaeringsdrivende.beskrivelse').type(omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse)
        selectValueForId('haddePensjonsgivendeInntekt.svar', omDenAvdoede.haddePensjonsgivendeInntekt.svar)
        selectValueForId('doedsfallAarsak', omDenAvdoede.doedsfallAarsak)
        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Situasjonen din" og gå til neste', () => {
        cy.url().should('include', 'steg/situasjonen-din')
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'land.json' }).as('alleland')

        // Verifiser felter og fyll ut skjema.
        const dinSituasjon = mockSoeknad.dinSituasjon
        selectValue(dinSituasjon.jobbStatus)

        dinSituasjon.arbeidsforhold.map((arbeid, idx) => {
            const baseId = `arbeidsforhold\[${idx}\].`

            getById(baseId + 'arbeidsgiver').type(arbeid.arbeidsgiver)

            selectValueForId(baseId + 'ansettelsesforhold', arbeid.ansettelsesforhold)

            getById(baseId + 'arbeidsmengde.svar').type(arbeid.arbeidsmengde.svar)
            getById(baseId + 'arbeidsmengde.type')
                .find('select')
                .select(arbeid.arbeidsmengde.type)

            selectValueForId(baseId + 'midlertidig.svar', arbeid.midlertidig.svar)
            getById(baseId + 'midlertidig.sluttdatoVelger').type(arbeid.midlertidig.sluttdatoVelger)

            selectValueForId(
                baseId + 'forventerEndretArbeidssituasjon.svar',
                arbeid.forventerEndretArbeidssituasjon.svar
            )
            getById(baseId + 'forventerEndretArbeidssituasjon.beskrivelse').type(
                arbeid.forventerEndretArbeidssituasjon.beskrivelse
            )

            selectValueForId(baseId + 'sagtOppEllerRedusert.svar', arbeid.sagtOppEllerRedusert.svar)
        })

        selectValue(dinSituasjon.utdanning.hoyesteFullfoerteUtdanning)

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Inntekten din" og gå til neste', () => {
        cy.url().should('include', 'steg/inntekten-din')
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'land.json' }).as('alleland')

        // Verifiser felter og fyll ut skjema.
        const inntektenDin = mockSoeknad.inntektenDin
        inntektenDin.inntektstyper.map((inntektsType) => selectValue(inntektsType))

        // Lønnsinntekt
        getById('loennsinntekt.arbeidsinntektAaretFoer').type(inntektenDin.loennsinntekt.arbeidsinntektAaretFoer)
        getById('loennsinntekt.arbeidsinntektIAar.tilDoedsfall').type(
            inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall
        )
        getById('loennsinntekt.arbeidsinntektIAar.etterDoedsfall').type(
            inntektenDin.loennsinntekt.arbeidsinntektIAar.etterDoedsfall
        )

        selectValueForId(
            'loennsinntekt.forventerEndringAvInntekt.svar',
            inntektenDin.loennsinntekt.forventerEndringAvInntekt.svar
        )

        // Næringsinntekt
        getById('naeringsinntekt.arbeidsinntektAaretFoer').type(inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer)
        getById('naeringsinntekt.arbeidsinntektIAar.tilDoedsfall').type(
            inntektenDin.naeringsinntekt.arbeidsinntektIAar.tilDoedsfall
        )
        getById('naeringsinntekt.arbeidsinntektIAar.etterDoedsfall').type(
            inntektenDin.naeringsinntekt.arbeidsinntektIAar.etterDoedsfall
        )

        selectValueForId(
            'naeringsinntekt.forventerEndringAvInntekt.svar',
            inntektenDin.naeringsinntekt.forventerEndringAvInntekt.svar
        )

        // Pensjon eller uføre
        selectValue(inntektenDin.pensjonEllerUfoere.pensjonstype)

        getById('pensjonEllerUfoere.tjenestepensjonsordning.type')
            .find('select')
            .select(inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.type)
        getById('pensjonEllerUfoere.tjenestepensjonsordning.utbetaler').type(
            inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.utbetaler
        )

        selectValueForId('pensjonEllerUfoere.utland.svar', inntektenDin.pensjonEllerUfoere.utland.svar)

        getById('pensjonEllerUfoere.utland.land').find('select').select(inntektenDin.pensjonEllerUfoere.utland.land)

        getById('pensjonEllerUfoere.utland.type').type(inntektenDin.pensjonEllerUfoere.utland.type)
        getById('pensjonEllerUfoere.utland.beloep').type(inntektenDin.pensjonEllerUfoere.utland.beloep)
        getById('pensjonEllerUfoere.utland.valuta').type(inntektenDin.pensjonEllerUfoere.utland.valuta)

        // Annen inntekt
        selectValue(inntektenDin.annenInntekt.inntektEllerUtbetaling)

        getById('annenInntekt.beloep').type(inntektenDin.annenInntekt.beloep)

        // Andre ytelser
        selectValueForId('ytelserNAV.svar', inntektenDin.ytelserNAV.svar)
        inntektenDin.ytelserNAV.soekteYtelser.map((ytelse) => selectValueForId('ytelserNAV.soekteYtelser', ytelse))

        selectValueForId('ytelserAndre.svar', inntektenDin.ytelserAndre.svar)
        inntektenDin.ytelserAndre.soekteYtelser.map((ytelse) => selectValueForId('ytelserAndre.soekteYtelser', ytelse))

        getById('ytelserAndre.pensjonsordning').type('Statens pensjonskasse')

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om barn" og gå til neste', () => {
        cy.url().should('include', 'steg/om-barn')
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'land.json' }).as('alleland')

        // Legg til barn
        mockSoeknad.opplysningerOmBarn.barn.map((barn) => {
            cy.get('[data-testid=legg-til-barn-knapp]').click()

            getById('fornavn').type(barn.fornavn)
            getById('etternavn').type(barn.etternavn)
            getById('foedselsnummer').type(barn.foedselsnummer)
            getById('statsborgerskap').find('select').select(barn.statsborgerskap)
            selectValueForId('bosattUtland.svar', barn.bosattUtland.svar)
            selectValue('barnRelasjon.fellesbarnMedAvdoede')
            if (barn.foedselsnummer === '07010776133') {
                // under 18 år
                selectValueForId('harBarnetVerge.svar', barn.harBarnetVerge.svar)
            }
            getById('leggTilBarn').click()
        })

        selectValue(IValg.JA)

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal verifisere at oppsummeringen er i henhold til utfyllingen', () => {
        cy.url().should('include', 'steg/oppsummering')

        /*
        i18n.language = "nb";
        const tekster = new ObjectTreeReader(i18n).traverse(mockSoeknad);
        tekster
            .filter(
                (tekst) =>
                    ![
                        "harSamtykket",
                        "sistLagretDato",
                        "klarForLagring",
                        "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.0.fraDato",
                        "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.0.tilDato",
                    ].includes(tekst.key)
            )
            // ToDo: Burde også sjekke at innhold er korrekt, men sliter med å få oversatt verdiene.
            .map((tekst) => getById(tekst.key));
        */
    })

    it('Skal bli sendt til kvitteringssiden ved suksessfull søknad', () => {
        cy.intercept('POST', `${basePath}/api/api/soeknad`, '13').as('postSoeknad')

        // Send inn søknad
        cy.get('[type="button"').contains('Send søknad').click()
        cy.get('[type="button"').contains('Ja, send søknad').click()

        // Verifiser søknad mottatt
        // TODO: Vil ikke lenger fungere nå som sendt data er annerledes fra state

        // Verifiser kvitteringsside
        cy.url().should('include', '/skjema/sendt')
        cy.contains('Søknaden din er sendt til oss')
    })
})
