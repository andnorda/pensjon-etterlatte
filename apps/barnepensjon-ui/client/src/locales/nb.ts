// @ts-nocheck
// prettier-ignore
const frontPage = {
    'title': 'Søk om gjenlevendepensjon eller overgangsstønad',
    'hello': `Hei, {fornavn} {etternavn}`,
    'startApplication': 'Start søknad',
    'aboutTheBenefit.content':
        'Hvis ektefellen, partneren eller samboeren din er død, kan du ha rett til gjenlevendepensjon eller overgangsstønad til gjenlevende. Du kan også ha rett til støtte hvis du tidligere har vært gift, partner eller samboer med avdøde. Vi vil vurdere om du har rett på gjenlevendepensjon eller overgangsstønad basert på din situasjon. Inntekten din avgjør hvor mye penger du kan få.',
    'aboutTheBenefit.paperApplication.content':
        'Får du alderspensjon eller uføretrygd fra før? Da kan du søke om gjenlevendetillegg i uføretrygd eller gjenlevenderett i alderspensjon. Du må søke på',
    'aboutTheBenefit.paperApplication.href':
        'https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/gjenlevende-ektefelle-partner-eller-samboer#NAV170105',
    'aboutTheBenefit.paperApplication.text': 'papir.',
    'aboutTheBenefit.linkSurvivor.href': 'https://www.nav.no/gjenlevendepensjon',
    'aboutTheBenefit.linkSurvivor.text': 'Mer om gjenlevendepensjon',
    'aboutTheBenefit.linkTransitionalBenefit.href': 'https://www.nav.no/overgangsstonad-gjenlevende',
    'aboutTheBenefit.linkTransitionalBenefit.text': 'Mer om overgangsstønad',
    'childrensPension.title': 'Du kan også søke om barnepensjon',
    'childrensPension.content':
        'Har du felles barn under 18 år med avdøde, kan barnet/ barna ha rett til barnepensjon. Du kan både søke om gjenlevendepensjon og barnepensjon i denne søknaden.',
    'childrensPension.href': 'https://www.nav.no/barnepensjon',
    'childrensPension.text': 'Mer om barnepensjon',
    'retrievalOfInformation.title': 'Vi henter informasjonen vi trenger',
    'retrievalOfInformation.content':
        'For å kunne behandle søknaden din trenger vi informasjon om deg, avdøde, eventuelle barn og eventuell samboer.\nVi henter:',
    'retrievalOfInformation.contentList.li1': '<strong>Personinformasjon</strong> fra Folkeregisteret',
    'retrievalOfInformation.contentList.li2': '<strong>Inntektsinformasjon</strong> fra Skatteetaten',
    'retrievalOfInformation.contentList.li3':
        'Opplysninger om <strong>arbeidsforhold</strong> fra Arbeidsgiver- og arbeidstakerregisteret',
    'retrievalOfInformation.contentList.li4': 'Opplysninger om <strong>annen støtte fra NAV</strong>',
    'retrievalOfInformation.contentList.li5': 'Eventuelt informasjon fra <strong>utenlandske trygdemyndigheter</strong>',
    'retrievalOfInformation.infotext':
        'Vi jobber med å forbedre denne søknaden. Inntil videre må du legge inn de fleste opplysningene manuelt.',
    'retrievalOfInformation.link1.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvernerklaering-for-arbeids-og-velferdsetaten',
    'retrievalOfInformation.link1.text': 'Slik behandler vi personopplysningene dine',
    'retrievalOfInformation.link2.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvern-og-sikkerhet-pa-nav.no#chapter-3',
    'retrievalOfInformation.link2.text': 'Om personvern og sikkerhet på nav.no',
    'consent.title': 'Vi stoler på deg',
    'consent.content':
        'Du må gi oss riktige opplysninger for at vi skal kunne behandle søknaden din. \nHvis du får penger du ikke har rett til fordi du har latt være å informere eller gitt feil opplysninger, må du vanligvis betale tilbake.\n\n',
    'consent.link.text': 'mine plikter på nav.no',
    'consent.link.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/relatert-informasjon/du-har-plikt-til-a-gi-nav-riktige-opplysninger',
    'consent.approval': 'Jeg, {fornavn} {etternavn}, bekrefter at jeg vil gi riktige og fullstendige opplysninger.',
}

const selectScenario = {
    title: 'Søk barnepensjon',
    ingress: 'Velg din situasjon for å gå videre med søknaden',
    'btn.myChildren': 'Jeg skal søke om barnepensjon for mitt/mine barn',
    'btn.guardian': 'Jeg skal søke om barnepensjon for ett eller flere barn jeg er verge til',
    'btn.me': 'Jeg er over 18 år og søker på vegne av meg selv',
    'alert.title': 'Søke gjenlevendepensjon og barnepensjon?',
    'alert.description':
        'Du kan ha rettigheter som gjenlevende hvis den andre forelderen til barnet ditt dør. Da kan du søke om gjenlevendepensjon og barnepensjon i en og samme søknad.',
    'alert.description2': 'Gå til',
    'alert.link.href': 'https://www.nav.no/gjenlevendepensjon/soknad/',
    'alert.link.text': 'søknad om gjenlevendepensjon og barnepensjon',
    PARENT: 'Jeg skal søke om barnepensjon for mitt/mine barn',
    GUARDIAN: 'Jeg skal søke om barnepensjon for ett eller flere barn jeg er verge til',
    CHILD: 'Jeg er over 18 år og søker på vegne av meg selv',
    BOTH_PARENTS_DECEASED: 'Foreldreløs (begge foreldre døde)',
    ONE_PARENT_DECEASED: 'Kun én forelder er død',
}

const aboutYou = {
    title: 'Om deg',
    stayWhy:
        'Hvis du oppholder deg i et annet land enn Norge kan det avgjøre om du får gjenlevendepensjon og hvor mye du kan få.',
    addressOfResidenceApproved: 'Bor du på denne adressen?',
    alternativAddress: 'Oppgi nåværende bostedsadresse',
    staysInNorway: 'Oppholder du deg for tiden i Norge?',
    countryOfResidence: 'Oppgi land',
    medlemFolketrygdenUtland: 'Er du medlem i folketrygden under opphold i et annet land enn Norge?',
    yes: 'Ja',
    no: 'Nei',
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
    'staysAbroad.abroadStays.country': 'Land',
    'staysAbroad.abroadStays.type': 'Bodd og/eller arbeidet?',
    'staysAbroad.abroadStays.fromDate': 'Fra dato (valgfri)',
    'staysAbroad.abroadStays.toDate': 'Til dato (valgfri)',
    'staysAbroad.abroadStays.medlemFolketrygd': 'Var han eller hun medlem av folketrygden under oppholdet?',
    'staysAbroad.abroadStays.medlemFolketrygd.why':
        'Vi må vite om avdøde var medlem av folketrygden for å avgjøre rettigheten til barnepensjon.',
    'staysAbroad.abroadStays.pensionAmount': 'Oppgi eventuell pensjon han eller hun mottok fra dette landet (valgfri)',
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
    'oppholdUtlandType.BODD': 'Bodd',
    'oppholdUtlandType.ARBEIDET': 'Arbeidet',
    'btn.addCountry': '+ Legg til flere land',
    'btn.delete': 'Fjern',
}

const aboutChildren = {
    'childrensPension.applied': 'Søkt om barnepensjon',
    'childrensPension.applies': 'Søk om barnepensjon',
    'childrensPension.appliesInfo': 'Du kan søke om barnepensjon for barn under 18 år som du har felles med avdøde.',
    'childrensPension.appliesCheckbox': 'Ja, jeg søker om barnepensjon for barnet',
    'childrensPension.bankAccount.answer':
        'Skal barnepensjonen utbetales til samme kontonummer som du har oppgitt tidligere?',
    'childrensPension.bankAccount.information': 'Du kan legge til et eget kontonummer for barnet.',
    'childrensPension.bankAccount.bankAccount': 'Oppgi norsk kontonummer for utbetaling av barnepensjon',
    'childrensPension.bankAccount.placeholder': '11 siffer',
    'childrensPension.taxWithhold.answer': 'Ønsker du at vi legger inn et skattetrekk for barnepensjonen?',
    'childrensPension.taxWithhold.helpText':
        'Barnepensjon er skattepliktig, men vi trekker ikke skatt av beløpet uten at vi får beskjed om det. Hvis du har spørsmål om skatt må du ta kontakt med Skatteetaten.',
    'childrensPension.taxWithhold.trekkprosent': 'Oppgi ønsket skattetrekk',
    'childrensPension.taxWithhold.placeholder': 'i prosent, eks. 20%',
    'childrenRelation.fellesbarnMedAvdoede': 'Jeg og avdøde',
    'childrenRelation.avdoedesSaerkullsbarn': 'Avdøde',
    'childrenRelation.egneSaerkullsbarn': 'Jeg',
    livesIn: 'Bor i',
    'staysAbroad.answer': 'Bor barnet i et annet land enn Norge?',
    'staysAbroad.country': 'Land',
    'staysAbroad.address': 'Adresse i utlandet',
    dailyCare: 'Har du daglig omsorg for dette barnet?',
    lastName: 'Etternavn',
    'common.fnrPlaceholder': '11 siffer',
    'common.norway': 'Norge',
    fnr: 'Barnets fødselsnummer / d-nummer',
    firstName: 'Fornavn',
    pregnantOrNewlyBorn: 'Venter du barn eller har du barn som ikke er registrert i folkeregisteret?',
    'childHasGuardianship.lastName': 'Etternavn (valgfri)',
    'childHasGuardianship.firstName': 'Fornavn (valgfri)',
    'childHasGuardianship.name': 'Navn på verge',
    'childHasGuardianship.answer': 'Er det oppnevnt en verge for barnet?',
    'childHasGuardianship.fnr': 'Fødselsnummer til verge (valgfri)',
    'childHasGuardianship.fnrPlaceholder': '11 siffer',
    information:
        'Dersom du har eller har hatt barn kan det påvirke retten din til gjenlevendepensjon. Derfor må du oppgi alle barn, uavhengig av hvor gamle de er. Dette gjelder barn du har felles med avdøde, avdødes egne barn, og dine egne barn. \n\n Hvis du har felles barn under 18 år med avdøde kan du også søke om barnepensjon her. Barn over 18 år må søke selv.',
    'infoCard.residence': 'BOSTED',
    'infoCard.fnr': 'FØDSELSNUMMER',
    'infoCard.parents': 'FORELDRE TIL BARNET',
    'infoCard.citizenship': 'STATSBORGERSKAP',
    yes: 'Ja',
    'btn.removeFromApplication': 'Fjern fra søknad',
    'btn.addChild': '+ Legg til barn',
    'btn.cancel': 'Avbryt',
    'btn.change': 'Endre',
    'btn.save': 'Lagre',
    no: 'Nei',
    relation: 'Hvem er foreldre til barnet?',
    relationHelpText:
        'Vi må vite om dette er et barn du har felles med avdøde, avdødes eget barn, eller ditt eget barn.',
    citizenship: 'Statsborgerskap',
    applicationForChildcare: 'Informasjon om stønad til barnetilsyn',
    'applicationForChildcare.description':
        'Du kan få stønad til barnetilsyn hvis du er i arbeid, selvstendig næringsdrivende eller etablerer en egen virksomhet og har omsorg for barn under 18 år. Det er en forutsetning at du overlater barnepasset til andre, og du har utgifter til barnepass.\n\nHvis du har en sykdom som gjør at du ikke kan være i arbeid, kan du få stønad i inntil 1 år. Sykdommen kan ikke være varig. Det er en forutsetning at barnepassordningen ble opprettet fordi du var i eller skulle begynne i arbeid, og at barnepasset fortsetter i den perioden du er syk.\n\nHvis du kombinerer arbeid med utdanning eller jobbsøking, kan du få stønad til barnetilsyn hvis du har utgifter til barnepass når du er på jobb.',
    'applicationForChildcare.approval': 'Jeg har utgifter til barnetilsyn',
    title: 'Om barn',
    titleModal: 'Om barnet',
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
    telefonnummerHjelpetext: 'Telefonnummeret er hentet fra Kontakt- og reservasjonsregisteret.',
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
    ibanHjelpetext: 'IBAN står for International Bank Account Number og er en internasjonal standard for kontonummer.',
    swift: 'Bankens S.W.I.F.T (BIC) adresse',
    swiftHjelpetext:
        'BIC står for Bank Identifier Code, og er den koden som identifiserer banken. BIC kalles også SWIFT, og er påkrevd ved betaling til en rekke land.',
}

const oppsummering = {
    tittel: 'Oppsummering',
    beskrivelse:
        'Les gjennom oppsummeringen av din søknad før du sender. \nHvis du trenger å gjøre endringer, kan du gå tilbake og gjøre det.',
}

const radiobuttons = {
    JA: 'Ja',
    NEI: 'Nei',
    VET_IKKE: 'Vet ikke',
}

const error = {
    tittel: 'For å gå videre må du rette opp i dette:',
    'bostedsadresseBekreftet.required': 'Spørsmål om bostedsadresse må besvares',
    'alternativAddresse.required': 'Du må oppgi nåværende bostedsadresse',
}

const texts = {
    felles,
    frontPage,
    loggedInUserInfo,
    aboutChildren,
    aboutYou,
    aboutTheDeceased,
    radiobuttons,
    oppsummering,
    utbetalingsInformasjon,
    selectScenario,
    error,
}

export default texts
