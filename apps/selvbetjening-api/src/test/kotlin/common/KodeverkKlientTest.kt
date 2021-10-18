package common

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.features.defaultRequest
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.http.takeFrom
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.kodeverk.KodeverkKlient
import no.nav.etterlatte.kodeverk.KodeverkService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Disabled
internal class KodeverkKlientTest {

    lateinit var httpClient: HttpClient

    @BeforeAll
    fun setupClient() {
        httpClient = HttpClient(CIO) {
            install(JsonFeature) {
                serializer = JacksonSerializer {
                    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                    setSerializationInclusion(JsonInclude.Include.NON_NULL)
                }
            }
            defaultRequest {
                url.takeFrom("https://kodeverk.dev.adeo.no/api/v1/kodeverk/Postnummer/koder/betydninger?spraak=nb")
                headers["Nav-Consumer-Id"] = "srvbarnepensjon"
            }
        }
    }

    @Test
    fun hentPostnummere() {
        runBlocking {
            val client = KodeverkKlient(httpClient)
            val poststed = client.hentPoststed("2730")
            val poststed2 = client.hentPoststed("0000")
            assertEquals("LUNNER", poststed)
            assertEquals("", poststed2)
        }
    }

}