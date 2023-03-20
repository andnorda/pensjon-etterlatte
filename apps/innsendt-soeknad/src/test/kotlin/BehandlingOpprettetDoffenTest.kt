import io.kotest.assertions.any
import io.mockk.spyk
import io.mockk.verify
import no.nav.etterlatte.BehandlingOpprettetDoffen
import no.nav.etterlatte.toJson
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.UUID

class BehandlingOpprettetDoffenTest {

    @Test
    fun `leser melding om opprettet behandling og registrerer dette i databasen`() {
        val message = mapOf(
            "@lagret_soeknad_id" to 1337,
            "sakId" to 123,
            "behandlingId" to UUID.randomUUID(),
            "@event_name" to "trenger_behandling"
        ).toJson()

        val db = spyk<TestRepo>()
        val testRapid = TestRapid().apply {
            BehandlingOpprettetDoffen(this, db)
        }

        testRapid.sendTestMessage(message)
        assertEquals(1, db.arkiveringOk.size)
        assertEquals(1, db.harBehandlingDoffen.size)

        verify(exactly = 1) { db.soeknadHarBehandling(any(), any(), any()) }
        verify(exactly = 0) { db.soeknadArkivert(any()) }
    }

}