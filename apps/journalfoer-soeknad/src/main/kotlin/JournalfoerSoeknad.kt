package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River

internal class JournalfoerSoeknad(rapidsConnection: RapidsConnection, private val pdf: GenererPdf, private val dok: JournalfoerDok) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@tittel") }
            validate { it.requireKey("@kanal") }
            validate { it.requireKey("@avsenderMottaker") }
            validate { it.requireKey("@sak") }
            validate { it.requireKey("@dokumenter") }
            validate { it.requireKey("@journalfoerendeEnhet") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: RapidsConnection.MessageContext) {
        //println(packet["@etterlatt_ident"].asText())

        runBlocking {


            packet["@journalpostId"] =  dok.journalfoerDok(packet, pdf.genererPdf(packet["@skjema_info"].asText(),"enTemplate"))
            context.send(packet.toJson())
        }
    }
}

interface GenererPdf {
    suspend fun genererPdf(input: String, template: String) : ByteArray
}
interface JournalfoerDok {
    suspend fun journalfoerDok(dokumentInnhold: JsonMessage, pdf: ByteArray) : String
}
