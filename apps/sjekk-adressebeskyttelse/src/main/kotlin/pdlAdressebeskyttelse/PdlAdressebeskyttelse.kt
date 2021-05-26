package no.nav.etterlatte.pdlAdressebeskyttelse

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.contentType
import no.nav.etterlatte.FinnAdressebeskyttelseForFnr

class PdlAdressebeskyttelse(private val client: HttpClient, private val apiUrl: String) : FinnAdressebeskyttelseForFnr {


    override suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): JsonNode {

        val query = getGraphqlResource("/hentAdressebeskyttelse.graphql")

        val request = GraphqlRequest(query, Variables(identer = identer))

        client.post<ObjectNode>(apiUrl) {
            header("Tema", "PEN")
            accept(ContentType.Application.Json)
            contentType(ContentType.Application.Json)
            body = request
        }.also {

        return it.get("data").get("hentPersonBolk")//.get("adressebeskyttelse").get("gradering")
        }
    }
    fun getGraphqlResource(file: String): String =
        javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")

    data class GraphqlRequest(
        val query: String,
        val variables: Variables
    )

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonIgnoreProperties(ignoreUnknown = true)
    data class Variables(
        val ident: String? = null,
        val identer: List<String>? = null
    )
}