package no.nav.etterlatte.pdl

import io.ktor.client.HttpClient
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.contentType
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseResponse
import no.nav.etterlatte.libs.common.pdl.GraphqlRequest
import no.nav.etterlatte.libs.common.pdl.Variables
import org.slf4j.LoggerFactory

interface Pdl {
    suspend fun finnAdressebeskyttelseForFnr(fnr: List<String>): AdressebeskyttelseResponse
}

class PdlKlient(private val client: HttpClient, private val apiUrl: String) : Pdl {
    private val logger = LoggerFactory.getLogger(PdlKlient::class.java)

    /**
     * Henter personer og tilknyttet adressebeskyttelse fra PDL.
     * Dersom en person ikke har adressebeskyttelse vil personobjektet inneholde en tom liste adressebeskyttelse.
     *
     * @param fnr: Liste over fødselsnummer.
     *
     * @return [AdressebeskyttelseResponse]: Responsobjekt fra PDL.
     */
    override suspend fun finnAdressebeskyttelseForFnr(fnr: List<String>): AdressebeskyttelseResponse {
        val query = hentQuery()

        val request = GraphqlRequest(query, Variables(identer = fnr))

        val response = client.post<AdressebeskyttelseResponse>(apiUrl) {
            header("Tema", "PEN")
            accept(ContentType.Application.Json)
            contentType(ContentType.Application.Json)
            body = request
        }

        // Logge feil dersom det finnes noen
        response.errors?.forEach { error ->
            logger.error("Feil ved uthenting av adressebeskyttelse", error.toString())
        }

        return response
    }

    private fun hentQuery(): String =
        javaClass.getResource("/hentAdressebeskyttelse.graphql")!!
            .readText()
            .replace(Regex("[\n\t]"), "")
}