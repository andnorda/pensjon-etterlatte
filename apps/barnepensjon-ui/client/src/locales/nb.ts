// @ts-nocheck
// prettier-ignore
const forside = {
    'tittel': 'Søk om gjenlevendepensjon eller overgangsstønad',
    'hei': `Hei, {fornavn} {etternavn}`,
    'startSoeknad': 'Start søknad',
    'omYtelsene.innhold':
        'Hvis ektefellen, partneren eller samboeren din er død, kan du ha rett til gjenlevendepensjon eller overgangsstønad til gjenlevende. Du kan også ha rett til støtte hvis du tidligere har vært gift, partner eller samboer med avdøde. Vi vil vurdere om du har rett på gjenlevendepensjon eller overgangsstønad basert på din situasjon. Inntekten din avgjør hvor mye penger du kan få.',
    'omYtelsene.papirsoeknad.innhold':
        'Får du alderspensjon eller uføretrygd fra før? Da kan du søke om gjenlevendetillegg i uføretrygd eller gjenlevenderett i alderspensjon. Du må søke på',
    'omYtelsene.papirsoeknad.href':
        'https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/gjenlevende-ektefelle-partner-eller-samboer#NAV170105',
    'omYtelsene.papirsoeknad.tekst': 'papir.',
    'omYtelsene.lenkeGjenlevende.href': 'https://www.nav.no/gjenlevendepensjon',
    'omYtelsene.lenkeGjenlevende.tekst': 'Mer om gjenlevendepensjon',
    'omYtelsene.lenkeOvergangsstoenad.href': 'https://www.nav.no/overgangsstonad-gjenlevende',
    'omYtelsene.lenkeOvergangsstoenad.tekst': 'Mer om overgangsstønad',
    'barnepensjon.tittel': 'Du kan også søke om barnepensjon',
    'barnepensjon.innhold':
        'Har du felles barn under 18 år med avdøde, kan barnet/ barna ha rett til barnepensjon. Du kan både søke om gjenlevendepensjon og barnepensjon i denne søknaden.',
    'barnepensjon.href': 'https://www.nav.no/barnepensjon',
    'barnepensjon.tekst': 'Mer om barnepensjon',
    'uthentingAvInfo.tittel': 'Vi henter informasjonen vi trenger',
    'uthentingAvInfo.innhold':
        'For å kunne behandle søknaden din trenger vi informasjon om deg, avdøde, eventuelle barn og eventuell samboer.\nVi henter:',
    'uthentingAvInfo.innholdListe.li1': '<strong>Personinformasjon</strong> fra Folkeregisteret',
    'uthentingAvInfo.innholdListe.li2': '<strong>Inntektsinformasjon</strong> fra Skatteetaten',
    'uthentingAvInfo.innholdListe.li3':
        'Opplysninger om <strong>arbeidsforhold</strong> fra Arbeidsgiver- og arbeidstakerregisteret',
    'uthentingAvInfo.innholdListe.li4': 'Opplysninger om <strong>annen støtte fra NAV</strong>',
    'uthentingAvInfo.innholdListe.li5': 'Eventuelt informasjon fra <strong>utenlandske trygdemyndigheter</strong>',
    'uthentingAvInfo.infotekst':
        'Vi jobber med å forbedre denne søknaden. Inntil videre må du legge inn de fleste opplysningene manuelt.',
    'uthentingAvInfo.lenke1.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvernerklaering-for-arbeids-og-velferdsetaten',
    'uthentingAvInfo.lenke1.tekst': 'Slik behandler vi personopplysningene dine',
    'uthentingAvInfo.lenke2.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvern-og-sikkerhet-pa-nav.no#chapter-3',
    'uthentingAvInfo.lenke2.tekst': 'Om personvern og sikkerhet på nav.no',
    'samtykke.tittel': 'Vi stoler på deg',
    'samtykke.innhold':
        'Du må gi oss riktige opplysninger for at vi skal kunne behandle søknaden din. \nHvis du får penger du ikke har rett til fordi du har latt være å informere eller gitt feil opplysninger, må du vanligvis betale tilbake.\n\n',
    'samtykke.lenke.tekst': 'mine plikter på nav.no',
    'samtykke.lenke.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/relatert-informasjon/du-har-plikt-til-a-gi-nav-riktige-opplysninger',
    'samtykke.bekreftelse': 'Jeg, {fornavn} {etternavn}, bekrefter at jeg vil gi riktige og fullstendige opplysninger.',
}

const velgScenarie = {
    tittel: 'Søk barnepensjon',
    ingress: 'Velg din situasjon for å gå videre med søknaden',
    'knapp.mineBarn': 'Jeg skal søke om barnepensjon for mitt/mine barn',
    'knapp.verge': 'Jeg skal søke om barnepensjon for ett eller flere barn jeg er verge til',
    'knapp.megSelv': 'Jeg er over 18 år og søker på vegne av meg selv',
    'alert.tittel': 'Søke gjenlevendepensjon og barnepensjon?',
    'alert.beskrivelse':
        'Du kan ha rettigheter som gjenlevende hvis den andre forelderen til barnet ditt dør. Da kan du søke om gjenlevendepensjon og barnepensjon i en og samme søknad.',
    'alert.beskrivelse2': 'Gå til',
    'alert.lenke.href': 'https://www.nav.no/gjenlevendepensjon/soknad/',
    'alert.lenke.tekst': 'søknad om gjenlevendepensjon og barnepensjon',
}

const omDeg = {
    tittel: 'Om deg',
    oppholdHvorfor:
        'Hvis du oppholder deg i et annet land enn Norge kan det avgjøre om du får gjenlevendepensjon og hvor mye du kan få.',
    bostedsadresseBekreftet: 'Bor du på denne adressen?',
    alternativAdresse: 'Oppgi nåværende bostedsadresse',
    oppholderSegINorge: 'Oppholder du deg for tiden i Norge?',
    oppholdsland: 'Oppgi land',
    medlemFolketrygdenUtland: 'Er du medlem i folketrygden under opphold i et annet land enn Norge?',
    ja: 'Ja',
    nei: 'Nei',
}

const aboutTheDeceased = {
    title: 'Om den avdøde',
    who: 'Hvem er det som er død?',
    firstName: 'Fornavn',
    lastName: 'Etternavn',
    dateOfDeath: 'Når skjedde dødsfallet?',
    'abroadStays.title': 'Opphold utenfor Norge',
    'abroadStays.ingress':
        'Vi trenger å vite om avdøde har bodd eller arbeidet utenfor Norge. Dette kan både påvirke hvor mye du kan få i gjenlevendepensjon og gi deg pensjonsrettigheter fra andre land.',
    'abroadStays.hasStaysAbroad': 'Bodde eller arbeidet han eller hun i et annet land enn Norge etter fylte 16 år?',
    fnrDnr: 'Fødselsnummer / d-nummer',
    'fnrDnr.placeholder': '11 siffer',
    citizenship: 'Statsborgerskap',
    'selfEmplyment.title': 'Næringsinntekt',
    'selfEmplyment.ingress':
        'Vi trenger å vite om avdøde hadde inntekt som selvstendig næringsdrivende. Dette er viktig når vi skal beregne hvor mye du kan få i gjenlevendepensjon. Vi henter informasjon om andre inntekter.',
    'selfEmplyment.wasSelfEmployed': 'Var han eller hun selvstendig næringsdrivende?',
    'selfEmplyment.selfEmplymentDetails.income': 'Oppgi næringsinntekt fra kalenderåret før dødsfallet (valgfri)',
    'selfEmplyment.selfEmplymentDetails.income.placeholder': 'Samlet årsinntekt før skatt',
    'selfEmplyment.selfEmplymentDetails.incomeAtDeath': 'Hadde han eller hun næringsinntekt når dødsfallet skjedde?',
    'other.title': 'Annet',
    occupationalInjury: 'Skyldes dødsfallet yrkesskade eller yrkessykdom?',
    'occupationalInjury.why':
        'Hvis dødsfallet skyldes godkjent yrkesskade eller yrkessykdom kan det avgjøre hvor mye du kan få.',
    'militaryService.completed':
        'Har han eller hun gjennomført militær eller sivil førstegangstjeneste som varte minst 30 dager?',
    'militaryService.why': 'Dette kan gi opptjening som tas med i beregningen av barnepensjonen.',
    'militaryService.period': 'Hvilke(-t) år? (valgfri)',
}

const loggedInUserInfo = {
    advarsel: 'Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos Folkeregisteret.',
    valgfritt: 'Alle felt må fylles ut, bortsett fra de som er markert som valgfrie.',
}

const felles = {
    navn: 'Navn',
    fnrDnr: 'Fødselsnummer / d-nummer',
    adresse: 'Bostedsadresse',
    sivilstatus: 'Sivilstatus',
    statsborgerskap: 'Statsborgerskap',
    telefonnummer: 'Telefonnummer',
    telefonnummerHjelpetekst: 'Telefonnummeret er hentet fra Kontakt- og reservasjonsregisteret.',
    hvorforSpoerVi: 'Hvorfor spør vi om dette',
    datoformat: '(dd.mm.yyyy)',
    datoEksempel: 'eks. 01.11.2020',
    velgLand: 'Velg land',
    velgSpraak: 'Velg språk',
}

const utbetalingsInformasjon = {
    tittel: 'Oppgi bankopplysninger',
    NORSK: 'Norsk',
    UTENLANDSK: 'Utenlandsk',
    kontonummer: 'Oppgi norsk kontonummer for utbetaling',
    informasjon: 'Du kan bare ha ett kontonummer registrert hos NAV.',
    bankkontoType: 'Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?',
    utenlandskBankNavn: 'Bankens navn',
    utenlandskBankAdresse: 'Bankens fulle adresse',
    iban: 'IBAN-nummer',
    ibanHjelpetekst: 'IBAN står for International Bank Account Number og er en internasjonal standard for kontonummer.',
    swift: 'Bankens S.W.I.F.T (BIC) adresse',
    swiftHjelpetekst:
        'BIC står for Bank Identifier Code, og er den koden som identifiserer banken. BIC kalles også SWIFT, og er påkrevd ved betaling til en rekke land.',
}

const radiobuttons = {
    JA: 'Ja',
    NEI: 'Nei',
    VET_IKKE: 'Vet ikke',
}

const error = {
    'bostedsadresseBekreftet.required': 'Spørsmål om bostedsadresse må besvares',
    'alternativAddresse.required': 'Du må oppgi nåværende bostedsadresse',
}

const tekster = {
    felles,
    forside,
    loggedInUserInfo,
    omDeg,
    aboutTheDeceased,
    radiobuttons,
    utbetalingsInformasjon,
    velgScenarie,
    error,
}

export default tekster
