import kotliquery.queryOf
import kotliquery.sessionOf
import kotliquery.using
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.LagretSoeknad
import no.nav.etterlatte.PostgresSoeknadRepository
import no.nav.etterlatte.PostgresSoeknadRepository.Companion.Status
import no.nav.etterlatte.UlagretSoeknad
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import java.time.ZoneOffset
import java.time.ZonedDateTime

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class DbIntegrationTest {
    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:12")

    private lateinit var db: PostgresSoeknadRepository
    private lateinit var dsb: DataSourceBuilder

    @BeforeAll
    fun beforeAll() {
        postgreSQLContainer.start()
        postgreSQLContainer.withUrlParam("user", postgreSQLContainer.username)
        postgreSQLContainer.withUrlParam("password", postgreSQLContainer.password)

        dsb = DataSourceBuilder(mapOf("DB_JDBC_URL" to postgreSQLContainer.jdbcUrl))
        dsb.migrate()

        db = PostgresSoeknadRepository.using(dsb.getDataSource())
    }

    @AfterAll
    fun afterAll() {
        postgreSQLContainer.stop()
    }

    @Test
    fun `Lagring og uthenting av kladd fungerer som forventet`() {
        val fnr = "11111111111"
        val json = """{"harSamtykket":true}"""

        val soeknad = UlagretSoeknad(fnr, json)

        val lagretKladd = db.lagreKladd(soeknad)

        val funnetKladd = db.finnKladd(fnr)!!

        assertNotNull(funnetKladd.id)
        assertEquals(fnr, funnetKladd.fnr)
        assertEquals(json, funnetKladd.soeknad)

        assertEquals(lagretKladd, funnetKladd)
    }

    @Test
    fun `Hent kladd som ikke finnes`() {
        val kladd = db.finnKladd("finnes ikke")

        assertNull(kladd)
    }

    @Test
    fun `Lagre ferdig søknad hvor kladd IKKE finnes`() {
        val fnr = "22222222222"
        val json = """{"harSamtykket":true}"""

        assertNull(db.finnKladd(fnr))

        val soeknad = UlagretSoeknad(fnr, json)

        val lagretSoeknad = db.lagreSoeknad(soeknad)

        assertEquals(json, lagretSoeknad.soeknad)
    }

    @Test
    fun `Lagre ferdig søknad hvor kladd finnes`() {
        val fnr = "33333333333"
        val json = """{"harSamtykket":true}"""
        val soeknad = UlagretSoeknad(fnr, json)

        assertNull(db.finnKladd(fnr))

        val lagretKladd = db.lagreKladd(soeknad)
        assertNotNull(lagretKladd)

        val funnetKladd = db.finnKladd(fnr)!!
        assertEquals(lagretKladd.id, funnetKladd.id)
        assertEquals(lagretKladd.fnr, funnetKladd.fnr)
        assertEquals(lagretKladd.soeknad, funnetKladd.soeknad)

        val nyJson = """{"harSamtykket":true,"omDeg":{"bostedsadresseBekreftet":"Ja"}}"""
        val endretSoeknad = UlagretSoeknad(fnr, nyJson)

        val lagretSoeknad = db.lagreSoeknad(endretSoeknad)
        assertEquals(lagretKladd.id, lagretSoeknad.id)
        assertEquals(lagretKladd.fnr, lagretSoeknad.fnr)
        assertEquals(endretSoeknad.soeknad, lagretSoeknad.soeknad)
    }

    @Test
    fun `Kladd skal kunne slettes`() {
        val fnr = "44444444444"
        val json = """{"harSamtykket":true}"""
        val soeknad = UlagretSoeknad(fnr, json)

        assertNull(db.finnKladd(fnr))
        assertNotNull(db.lagreKladd(soeknad))

        assertTrue(db.slettKladd(fnr))
        assertNull(db.finnKladd(fnr))
    }

    @Test
    fun `Ferdigstilte søknader skal ikke slettes som kladd`() {
        val fnr = "55555555555"
        val json = """{"harSamtykket":true}"""
        val soeknad = UlagretSoeknad(fnr, json)

        assertNull(db.finnKladd(fnr))

        val lagretKladd = db.lagreKladd(soeknad)
        assertNotNull(lagretKladd)

        db.soeknadFerdigstilt(lagretKladd)
        assertFalse(db.slettKladd(fnr))
    }

    @Test
    fun `Kladder skal slettes etter 24 timer`() {
        val nowUTC = ZonedDateTime.now(ZoneOffset.UTC)
        lagreSoeknaderMedOpprettetTidspunkt(
            listOf(
                SoeknadTest(1000, "aaaaaaa", """{}""", nowUTC.minusDays(2)),
                SoeknadTest(1111, "bbbbbbb", """{}""", nowUTC.minusHours(24)),
                SoeknadTest(2222, "ccccccc", """{}""", nowUTC.minusHours(23).plusMinutes(59)),
                SoeknadTest(3333, "ddddddd", """{}""", nowUTC),
            )
        )

        assertEquals(2, db.slettUtgaatteKladder())

        assertNull(db.finnKladd("aaaaaaa"))
        assertNull(db.finnKladd("bbbbbbb"))
        assertNotNull(db.finnKladd("ccccccc"))
        assertNotNull(db.finnKladd("ddddddd"))
    }


    @Test
    fun `Kun kladder skal slettes etter 24 timer`() {
        val utgaatt = ZonedDateTime.now(ZoneOffset.UTC).minusDays(2)
        val soeknad = SoeknadTest(1000, "aaaaaaa", """{}""", utgaatt)
        lagreSoeknaderMedOpprettetTidspunkt(listOf(soeknad))
        assertNotNull(db.finnKladd(soeknad.fnr))

        // Skal ikke slette soeknader med hendelse "arkivert"
        slettHendelserForSoeknad(soeknad.id)
        db.soeknadArkivert(LagretSoeknad(soeknad.fnr, soeknad.data, soeknad.id))
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "arkiveringsfeil"
        slettHendelserForSoeknad(soeknad.id)
        db.soeknadFeiletArkivering(LagretSoeknad(soeknad.fnr, soeknad.data, soeknad.id), """{}""")
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "ferdigstillt"
        slettHendelserForSoeknad(soeknad.id)
        db.soeknadFerdigstilt(LagretSoeknad(soeknad.fnr, soeknad.data, soeknad.id))
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal ikke slette soeknader med hendelse "sendt"
        slettHendelserForSoeknad(soeknad.id)
        db.soeknadSendt(LagretSoeknad(soeknad.fnr, soeknad.data, soeknad.id))
        assertEquals(0, db.slettUtgaatteKladder())

        // Skal slette utgåtte soeknader med hendelse "lagretkladd"
        slettHendelserForSoeknad(soeknad.id)
        assertEquals(1, db.slettUtgaatteKladder())
        assertNull(db.finnKladd(soeknad.fnr))
    }

    private fun lagreSoeknaderMedOpprettetTidspunkt(soeknader: List<SoeknadTest>) {
        using(sessionOf(dsb.getDataSource())) { session ->
            session.transaction {
                soeknader.forEach { soeknad ->
                    it.run(
                        queryOf(
                            "INSERT INTO soeknad(id, fnr, data, opprettet) VALUES(?, ?, (to_json(?::json)), ?)",
                            soeknad.id,
                            soeknad.fnr,
                            soeknad.data,
                            soeknad.opprettet
                        ).asExecute
                    )
                }
            }
        }
    }

    private fun slettHendelserForSoeknad(soeknadId: Long) {
        using(sessionOf(dsb.getDataSource())) { session ->
            session.transaction {
                it.run(queryOf("DELETE FROM hendelse WHERE soeknad = ?", soeknadId).asExecute)
            }
        }
    }

    private data class SoeknadTest(
        val id: Long,
        val fnr: String,
        val data: String,
        val opprettet: ZonedDateTime
    )
}
