package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River

internal class JournalfoerSoeknad(
    rapidsConnection: RapidsConnection,
    private val pdf: GenererPdf,
    private val dok: JournalfoerDok
) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@template") }
            validate { it.requireKey("@journalpostInfo") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        try {
        runBlocking {
            packet["@journalpostId"] = dok.journalfoerDok(
                packet, pdf.genererPdf(packet["@skjema_info"], packet["@template"].asText())
            )
            context.publish(packet.toJson())
        }
    } catch( err: Exception) {
            println("Fillern, dette klarte jeg ikke: " + err)

        }
    }
}

interface GenererPdf {
    suspend fun genererPdf(input: JsonNode, template: String): ByteArray
}

interface JournalfoerDok {
    suspend fun journalfoerDok(dokumentInnhold: JsonMessage, pdf: ByteArray): String
}
