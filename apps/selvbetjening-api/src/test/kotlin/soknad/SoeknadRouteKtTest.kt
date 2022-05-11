package soknad

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.features.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.parametersOf
import io.ktor.jackson.jackson
import io.ktor.routing.Route
import io.ktor.routing.routing
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import no.nav.etterlatte.soknad.SoeknadService
import no.nav.etterlatte.soknad.soknadApi
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import libs.common.util.RetryResult

internal class SoeknadRouteKtTest {
    private val service = mockk<SoeknadService>()
    private val dummyJson = """{"dummy":"json"}"""
    private val kilde = "barnepensjon-ui"

    @Test
    fun `Skal lagre søknader`() {
        val soeknad =
            """{"soeknader":[{"type":"GJENLEVENDEPENSJON","imageTag":"j19fj390jf-jf13jf901","kilde":"gjenlevendepensjon-ui","spraak":"nb","harSamtykket":{"spoersmaal":"Jeg, STOR SNERK, bekrefter at jeg vil gi riktige og fullstendige opplysninger.","svar":true},"innsender":{"type":"INNSENDER","fornavn":{"spoersmaal":"Fornavn","svar":"STOR"},"etternavn":{"spoersmaal":"Etternavn","svar":"SNERK"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"11057523044"}},"utbetalingsInformasjon":{"spoersmaal":"Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?","svar":{"verdi":"UTENLANDSK","innhold":"Utenlandsk"},"opplysning":{"utenlandskBankNavn":{"spoersmaal":"Bankens navn","svar":{"innhold":"Polski Banki"}},"utenlandskBankAdresse":{"spoersmaal":"Bankens fulle adresse","svar":{"innhold":"Bankiszh Veizhc 13"}},"iban":{"spoersmaal":"IBAN-nummer","svar":{"innhold":"PL10105000997603123456789123"}},"swift":{"spoersmaal":"Bankens S.W.I.F.T (BIC) adresse","svar":{"innhold":"ALBPPLPW"}}}},"soeker":{"type":"GJENLEVENDE","fornavn":{"spoersmaal":"Fornavn","svar":"STOR"},"etternavn":{"spoersmaal":"Etternavn","svar":"SNERK"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"11057523044"},"statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":"Statsborgerskap-mock"},"sivilstatus":{"spoersmaal":"Sivilstatus","svar":"Sivilstatus-mock"},"adresse":{"spoersmaal":"Bostedsadresse","svar":"Adresse-mock 1, 0000 Poststed-mock"},"bostedsAdresse":{"spoersmaal":"Bor du på denne adressen?","svar":{"verdi":"JA","innhold":"Ja"}},"kontaktinfo":{"epost":{"spoersmaal":"E-post (valgfri)","svar":{"innhold":"test@nav.no"}},"telefonnummer":{"spoersmaal":"Telefonnummer (valgfri)","svar":{"innhold":"+47 999 888 77"}}},"oppholdUtland":{"spoersmaal":"Oppholder du deg for tiden i Norge?","svar":{"verdi":"NEI","innhold":"Nei"},"opplysning":{"land":{"spoersmaal":"Oppgi land","svar":{"innhold":"Polen"}},"medlemFolketrygd":{"spoersmaal":"Er du medlem i folketrygden under opphold i et annet land enn Norge?","svar":{"verdi":"NEI","innhold":"Nei"}}}},"nySivilstatus":{"spoersmaal":"Sivilstanden din i dag","svar":{"verdi":"SAMBOERSKAP","innhold":"Samboer"},"opplysning":{"type":"SAMBOER","fornavn":{"spoersmaal":"Fornavn","svar":"Nyski"},"etternavn":{"spoersmaal":"Etternavn","svar":"Polski"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"24014021406"},"fellesBarnEllertidligereGift":{"spoersmaal":"Har eller hadde dere barn sammen eller var dere tidligere gift?","svar":{"verdi":"NEI","innhold":"Nei"}},"inntekt":{"spoersmaal":"Har samboer inntekt?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"inntektstype":{"spoersmaal":"Inntektstype","svar":[{"verdi":"ANDRE_YTELSER","innhold":"Andre ytelser"},{"verdi":"KAPITALINNTEKT","innhold":"Kapitalinntekt"},{"verdi":"PENSJON","innhold":"Pensjon"},{"verdi":"ARBEIDSINNTEKT","innhold":"Arbeidsinntekt"}]},"samletBruttoinntektPrAar":{"spoersmaal":"Samlet årsinntekt før skatt","svar":{"innhold":"250000"}}}}}},"arbeidOgUtdanning":{"dinSituasjon":{"spoersmaal":"Hva er situasjonen din nå?","svar":[{"verdi":"UNDER_UTDANNING","innhold":"Jeg tar utdanning"},{"verdi":"SELVSTENDIG","innhold":"Jeg er selvstendig næringsdrivende"},{"verdi":"ARBEIDSTAKER","innhold":"Jeg er arbeidstaker"},{"verdi":"INGEN","innhold":"Annet"}]},"arbeidsforhold":{"spoersmaal":"Om arbeidsgiver","svar":[{"arbeidsgiver":{"spoersmaal":"Hva heter arbeidsgiver?","svar":{"innhold":"Norge AS"}},"ansettelsesforhold":{"spoersmaal":"Type ansettelse","svar":{"verdi":"FAST","innhold":"Fast ansatt"}},"stillingsprosent":{"spoersmaal":"Hvor mye jobber du?","svar":{"innhold":"100"}},"endretInntekt":{"spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 månedene?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"spoersmaal":"Hva er grunnen til endringene?","svar":{"innhold":"Årlig lønnsøkning"}}}}]},"selvstendig":{"spoersmaal":"Om næringen","svar":[{"firmanavn":{"spoersmaal":"Om næringen","svar":{"innhold":"Plopp shit"}},"orgnr":{"spoersmaal":"Organisasjonsnummer","svar":{"innhold":"999888777"}},"endretInntekt":{"spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 månedene?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"spoersmaal":"Hva er grunnen til endringene?","svar":{"innhold":"Går til helvete"}}}}]},"utdanning":{"spoersmaal":"dinSituasjon.utdanning.naavaerendeUtdanning.tittel","svar":{"navn":{"spoersmaal":"Navnet på utdanningen","svar":{"innhold":"Frogner Videregående "}},"startDato":{"spoersmaal":"Fra dato","svar":{"innhold":"1990-01-01"}},"sluttDato":{"spoersmaal":"Til dato","svar":{"innhold":"1993-01-01"}}}},"annet":{"spoersmaal":"Gi en beskrivelse av situasjonen din","svar":{"innhold":"Annen beskrivelse av situasjonen", "verdi":"ANNET"}}},"fullfoertUtdanning":{"spoersmaal":"Hva er din høyeste fullførte utdanning?","svar":{"verdi":"UNIVERSITET_OPPTIL_4_AAR","innhold":"Universitet eller høyskole til og med 4 år"}},"andreYtelser":{"kravOmAnnenStonad":{"spoersmaal":"Har du søkt om andre ytelser som du ikke har fått svar på?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"spoersmaal":"Hva har du søkt om?","svar":{"verdi":"SYKEPENGER","innhold":"Sykepenger"}}},"annenPensjon":{"spoersmaal":"Får du eller har du søkt om avtalefestet pensjon (AFP) eller annen pensjon fra andre enn NAV?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"spoersmaal":"Hvilken pensjonsordning?","svar":{"innhold":"KLP og diverse"}}},"pensjonUtland":{"spoersmaal":"Mottar du pensjon fra et annet land enn Norge?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"pensjonsType":{"spoersmaal":"Hva slags pensjon?","svar":{"innhold":"Alderspensjon"}},"land":{"spoersmaal":"Fra hvilket land?","svar":{"innhold":"Polen"}},"bruttobeloepPrAar":{"spoersmaal":"Årlig beløp før skatt i landets valuta","svar":{"innhold":"30000"}}}}},"uregistrertEllerVenterBarn":{"spoersmaal":"Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?","svar":{"verdi":"JA","innhold":"Ja"}},"forholdTilAvdoede":{"relasjon":{"spoersmaal":"Relasjonen din til avdøde da dødsfallet skjedde","svar":{"verdi":"SAMBOER","innhold":"Samboer"}},"datoForInngaattPartnerskap":{"spoersmaal":"Vi giftet oss","svar":{"innhold":"2022-01-02"}},"fellesBarn":{"spoersmaal":"Har eller hadde dere felles barn?","svar":{"verdi":"NEI","innhold":"Nei"}},"tidligereGift":{"spoersmaal":"Var du tidligere gift med avdøde?","svar":{"verdi":"JA","innhold":"Ja"}},"omsorgForBarn":{"spoersmaal":"Hadde du omsorg for avdødes barn på dødstidspunktet?","svar":{"verdi":"JA","innhold":"Ja"}}}},"avdoed":{"type":"AVDOED","fornavn":{"spoersmaal":"Fornavn","svar":"Polski"},"etternavn":{"spoersmaal":"Etternavn","svar":"Dødski"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"26104500284"},"datoForDoedsfallet":{"spoersmaal":"Når skjedde dødsfallet?","svar":{"innhold":"2022-01-04"}},"statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":{"innhold":"Norge"}},"utenlandsopphold":{"spoersmaal":"Bodde eller arbeidet han eller hun i et annet land enn Norge etter fylte 16 år?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":[{"land":{"spoersmaal":"Land","svar":{"innhold":"Polen"}},"fraDato":{"spoersmaal":"Fra dato (valgfri)","svar":{"innhold":"2001-01-04"}},"tilDato":{"spoersmaal":"Til dato (valgfri)","svar":{"innhold":"2003-01-04"}},"oppholdsType":{"spoersmaal":"Bodd og/eller arbeidet?","svar":[{"verdi":"BODD","innhold":"Bodd"},{"verdi":"ARBEIDET","innhold":"Arbeidet"}]},"medlemFolketrygd":{"spoersmaal":"Var han eller hun medlem av folketrygden under oppholdet?","svar":{"verdi":"NEI","innhold":"Nei"}},"pensjonsutbetaling":{"spoersmaal":"Oppgi eventuell pensjon han eller hun mottok fra dette landet (valgfri)","svar":{"innhold":"50 000 PLN"}}}]},"naeringsInntekt":{"spoersmaal":"Var han eller hun selvstendig næringsdrivende?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"naeringsinntektPrAarFoerDoedsfall":{"spoersmaal":"Oppgi næringsinntekt fra kalenderåret før dødsfallet (valgfri)","svar":{"innhold":"15135"}},"naeringsinntektVedDoedsfall":{"spoersmaal":"Hadde han eller hun næringsinntekt når dødsfallet skjedde?","svar":{"verdi":"JA","innhold":"Ja"}}}},"militaertjeneste":{"spoersmaal":"Har han eller hun gjennomført militær eller sivil førstegangstjeneste som varte minst 30 dager?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"spoersmaal":"Hvilke(-t) år? (valgfri)","svar":{"innhold":"1984"}}},"doedsaarsakSkyldesYrkesskadeEllerYrkessykdom":{"spoersmaal":"Skyldes dødsfallet yrkesskade eller yrkessykdom?","svar":{"verdi":"JA","innhold":"Ja"}}},"barn":[{"type":"BARN","fornavn":{"spoersmaal":"Fornavn","svar":"Barnski"},"etternavn":{"spoersmaal":"Etternavn","svar":"Polski"},"foedselsnummer":{"spoersmaal":"Barnets fødselsnummer / d-nummer","svar":"19040550081"},"statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":"Norge"},"utenlandsAdresse":{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"land":{"spoersmaal":"Land","svar":{"innhold":"Polen"}},"adresse":{"spoersmaal":"Adresse i utlandet","svar":{"innhold":"Polski gatski 13"}}}},"foreldre":[{"type":"FORELDER","fornavn":{"spoersmaal":"Fornavn","svar":"STOR"},"etternavn":{"spoersmaal":"Etternavn","svar":"SNERK"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"11057523044"}},{"type":"FORELDER","fornavn":{"spoersmaal":"Fornavn","svar":"Polski"},"etternavn":{"spoersmaal":"Etternavn","svar":"Dødski"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"26104500284"}}],"verge":{"spoersmaal":"Er det oppnevnt en verge for barnet?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"type":"VERGE","fornavn":{"spoersmaal":"Fornavn","svar":"Verg"},"etternavn":{"spoersmaal":"Etternavn","svar":"Vikernes"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"30106519672"}}}}]},{"type":"BARNEPENSJON","imageTag":"j19fj390jf-jf13jf901","kilde":"gjenlevendepensjon-ui","spraak":"nb","innsender":{"type":"INNSENDER","fornavn":{"spoersmaal":"Fornavn","svar":"STOR"},"etternavn":{"spoersmaal":"Etternavn","svar":"SNERK"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"11057523044"}},"harSamtykket":{"spoersmaal":"","svar":true},"utbetalingsInformasjon":{"spoersmaal":"Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?","svar":{"verdi":"NORSK","innhold":"Norsk"},"opplysning":{"kontonummer":{"spoersmaal":"Oppgi norsk kontonummer for utbetaling av barnepensjon","svar":{"innhold":"1234.12.31234"}},"skattetrekk":{"spoersmaal":"Ønsker du at vi legger inn et skattetrekk for barnepensjonen?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"spoersmaal":"Oppgi ønsket skattetrekk","svar":{"innhold":"30%"}}}}},"soeker":{"type":"BARN","fornavn":{"spoersmaal":"Fornavn","svar":"Barnski"},"etternavn":{"spoersmaal":"Etternavn","svar":"Polski"},"foedselsnummer":{"spoersmaal":"Barnets fødselsnummer / d-nummer","svar":"19040550081"},"statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":"Norge"},"utenlandsAdresse":{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"land":{"spoersmaal":"Land","svar":{"innhold":"Polen"}},"adresse":{"spoersmaal":"Adresse i utlandet","svar":{"innhold":"Polski gatski 13"}}}},"foreldre":[{"type":"FORELDER","fornavn":{"spoersmaal":"Fornavn","svar":"STOR"},"etternavn":{"spoersmaal":"Etternavn","svar":"SNERK"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"11057523044"}},{"type":"FORELDER","fornavn":{"spoersmaal":"Fornavn","svar":"Polski"},"etternavn":{"spoersmaal":"Etternavn","svar":"Dødski"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"26104500284"}}],"verge":{"spoersmaal":"Er det oppnevnt en verge for barnet?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"type":"VERGE","fornavn":{"spoersmaal":"Fornavn","svar":"Verg"},"etternavn":{"spoersmaal":"Etternavn","svar":"Vikernes"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"30106519672"}}}},"foreldre":[{"type":"GJENLEVENDE_FORELDER","fornavn":{"spoersmaal":"Fornavn","svar":"STOR"},"etternavn":{"spoersmaal":"Etternavn","svar":"SNERK"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"11057523044"},"statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":"Statsborgerskap-mock"},"adresse":{"spoersmaal":"Bostedsadresse","svar":"Adresse-mock 1, 0000 Poststed-mock"},"kontaktinfo":{"epost":{"spoersmaal":"E-post (valgfri)","svar":{"innhold":"test@nav.no"}},"telefonnummer":{"spoersmaal":"Telefonnummer (valgfri)","svar":{"innhold":"+47 999 888 77"}}}},{"type":"AVDOED","fornavn":{"spoersmaal":"Fornavn","svar":"Polski"},"etternavn":{"spoersmaal":"Etternavn","svar":"Dødski"},"foedselsnummer":{"spoersmaal":"Fødselsnummer","svar":"26104500284"},"datoForDoedsfallet":{"spoersmaal":"Når skjedde dødsfallet?","svar":{"innhold":"2022-01-04"}},"statsborgerskap":{"spoersmaal":"Statsborgerskap","svar":{"innhold":"Norge"}},"utenlandsopphold":{"spoersmaal":"Bodde eller arbeidet han eller hun i et annet land enn Norge etter fylte 16 år?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":[{"land":{"spoersmaal":"Land","svar":{"innhold":"Polen"}},"fraDato":{"spoersmaal":"Fra dato (valgfri)","svar":{"innhold":"2001-01-04"}},"tilDato":{"spoersmaal":"Til dato (valgfri)","svar":{"innhold":"2003-01-04"}},"oppholdsType":{"spoersmaal":"Bodd og/eller arbeidet?","svar":[{"verdi":"BODD","innhold":"Bodd"},{"verdi":"ARBEIDET","innhold":"Arbeidet"}]},"medlemFolketrygd":{"spoersmaal":"Var han eller hun medlem av folketrygden under oppholdet?","svar":{"verdi":"NEI","innhold":"Nei"}},"pensjonsutbetaling":{"spoersmaal":"Oppgi eventuell pensjon han eller hun mottok fra dette landet (valgfri)","svar":{"innhold":"50 000 PLN"}}}]},"naeringsInntekt":{"spoersmaal":"Var han eller hun selvstendig næringsdrivende?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"naeringsinntektPrAarFoerDoedsfall":{"spoersmaal":"Oppgi næringsinntekt fra kalenderåret før dødsfallet (valgfri)","svar":{"innhold":"15135"}},"naeringsinntektVedDoedsfall":{"spoersmaal":"Hadde han eller hun næringsinntekt når dødsfallet skjedde?","svar":{"verdi":"JA","innhold":"Ja"}}}},"militaertjeneste":{"spoersmaal":"Har han eller hun gjennomført militær eller sivil førstegangstjeneste som varte minst 30 dager?","svar":{"verdi":"JA","innhold":"Ja"},"opplysning":{"spoersmaal":"Hvilke(-t) år? (valgfri)","svar":{"innhold":"1984"}}},"doedsaarsakSkyldesYrkesskadeEllerYrkessykdom":{"spoersmaal":"Skyldes dødsfallet yrkesskade eller yrkessykdom?","svar":{"verdi":"JA","innhold":"Ja"}}}],"soesken":[]}]}"""

        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.sendSoeknader(any(), kilde) } returns RetryResult.Success()
            handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody(soeknad)
            }.apply {
                assertEquals(HttpStatusCode.OK, response.status())
                coVerify(exactly = 1) { service.sendSoeknader(any(), kilde) }
            }
        }
    }

    @Test
    fun `Skal lagre kladd`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.lagreKladd(any(), kilde) } returns RetryResult.Success(1)
            handleRequest(HttpMethod.Post, "/api/kladd?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody(dummyJson)
            }.apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals("1", response.content)
                coVerify(exactly = 1) { service.lagreKladd(any(), kilde) }
            }
        }
    }

    @Test
    fun `Skal hente kladd`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.hentKladd(kilde) } returns RetryResult.Success(dummyJson)
            handleRequest(HttpMethod.Get, "/api/kladd?kilde=$kilde").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals(dummyJson, response.content)
                coVerify(exactly = 1) { service.hentKladd(kilde) }
            }
        }
    }

    @Test
    fun `Skal håndtere at kladd ikke finnes`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.hentKladd(kilde) } returns RetryResult.Success(HttpStatusCode.NotFound)
            handleRequest(HttpMethod.Get, "/api/kladd?kilde=$kilde").apply {
                assertEquals(HttpStatusCode.NotFound, response.status())
                coVerify(exactly = 1) { service.hentKladd(kilde) }
            }
        }
    }

    @Test
    fun `Skal slette kladd`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.slettKladd(kilde) } returns RetryResult.Success(HttpStatusCode.OK)
            handleRequest(HttpMethod.Delete, "/api/kladd?kilde=$kilde").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                coVerify(exactly = 1) { service.slettKladd(kilde) }
            }
        }
    }
}

fun Application.testModule(routes: Route.() -> Unit) {
    install(ContentNegotiation) {
        jackson {
            enable(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
            disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            registerModule(JavaTimeModule())
        }
    }

    routing {
        routes()
    }
}
