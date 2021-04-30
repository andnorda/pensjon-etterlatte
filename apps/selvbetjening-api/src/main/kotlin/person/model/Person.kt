package no.nav.etterlatte.person.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import java.time.LocalDate
import java.time.LocalDateTime

@JsonIgnoreProperties(ignoreUnknown = true)
internal data class PersonResponse(
    val data: PersonResponseData? = null,
    val errors: List<ResponseError>? = null
)

internal data class PersonResponseData(
    val hentPerson: HentPerson? = null
)

internal data class HentPerson(
    val bostedsadresse: List<Bostedsadresse>,
    val navn: List<Navn>,
    val statsborgerskap: List<Statsborgerskap>,
    val foedsel: List<Foedsel>,
    val sivilstand: List<Sivilstand>
)

data class Navn(
    val fornavn: String,
    val mellomnavn: String? = null,
    val etternavn: String,
    val forkortetNavn: String? = null,
    val gyldigFraOgMed: LocalDate? = null,
    val folkeregistermetadata: Folkeregistermetadata? = null,
    val metadata: Metadata? = null
)

data class Statsborgerskap(
    val land: String,
    val gyldigFraOgMed: LocalDate? = null,
    val gyldigTilOgMed: LocalDate? = null,
    val metadata: Metadata
)

data class Foedsel(
    val foedselsdato: LocalDate? = null,
    val foedeland: String? = null,
    val foedested: String? = null,
    val foedselsaar: Int? = null,
    val folkeregistermetadata: Folkeregistermetadata? = null,
    val metadata: Metadata
)

data class Folkeregistermetadata(
    val gyldighetstidspunkt: LocalDateTime? = null
)

data class Metadata(
    val endringer: List<Endring>,
    val historisk: Boolean,
    val master: String,
    val opplysningsId: String
) {
    fun sisteRegistrertDato(): LocalDateTime {
        return endringer.maxByOrNull { it.registrert }?.registrert!!
    }
}

data class Endring(
    val kilde: String,
    val registrert: LocalDateTime,
    val registrertAv: String,
    val systemkilde: String,
    val type: Endringstype
)

enum class Endringstype {
    KORRIGER,
    OPPHOER,
    OPPRETT;
}

enum class Sivilstandstype {
    UOPPGITT,
    UGIFT,
    GIFT,
    ENKE_ELLER_ENKEMANN,
    SKILT,
    SEPARERT,
    REGISTRERT_PARTNER,
    SEPARERT_PARTNER,
    SKILT_PARTNER,
    GJENLEVENDE_PARTNER;
}

data class Sivilstand(
    val type: Sivilstandstype,
    val gyldigFraOgMed: LocalDate? = null,
    val relatertVedSivilstand: String? = null,
    val metadata: Metadata
)
