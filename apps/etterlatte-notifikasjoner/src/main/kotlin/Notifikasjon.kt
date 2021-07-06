package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.brukernotifikasjon.schemas.Beskjed
import no.nav.brukernotifikasjon.schemas.builders.BeskjedBuilder
import no.nav.brukernotifikasjon.schemas.builders.domain.PreferertKanal
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import java.net.URL
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit


internal class Notifikasjon(rapidsConnection: RapidsConnection) :

    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@dokarkivRetur") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.rejectKey("@notifikasjon") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {


        runBlocking {
            val dto = ProduceBeskjedDto(
                 tekst = "Vi bekrefter å ha mottat din søknad om Etterlatteytelse",
                 link = null,
                 grupperingsid = "ETTERLATTE",
                 eksternVarsling = true,
                 prefererteKanaler  = listOf("SMS", "EPOST")
                 //prefererteKanaler = emptyList()

            )
            packet["@notifikasjon"] = opprettNotifikasjonForIdent(packet["@fnr_soeker"].textValue(),dto).toString()
            context.publish(packet.toJson())
            }
    }
    
    fun opprettNotifikasjonForIdent(fnr: String, dto: ProduceBeskjedDto): Beskjed {
        val now = LocalDateTime.now(ZoneOffset.UTC)
        val weekFromNow = now.plus(7, ChronoUnit.DAYS)
        val build = BeskjedBuilder()
            .withFodselsnummer(fnr)
            .withGrupperingsId(dto.grupperingsid)
            .withTekst(dto.tekst)
            .withTidspunkt(now)
            .withSynligFremTil(weekFromNow)
            .withSikkerhetsnivaa(4)
            .withEksternVarsling(true)
            .withPrefererteKanaler(PreferertKanal.SMS)
        if(!dto.link.isNullOrBlank()) {
            build.withLink(URL(dto.link))
        }
        return build.build()
    }

}


