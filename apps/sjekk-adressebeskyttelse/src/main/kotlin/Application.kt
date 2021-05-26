package no.nav.etterlatte

import no.nav.helse.rapids_rivers.RapidApplication

fun main() {
    val env = System.getenv()
    RapidApplication.create(env).also {
        SjekkAdressebeskyttelse(it, AppBuilder(env).pdlService())
        Monitor(it)
    }.start()
}