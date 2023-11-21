import { TFunction } from 'i18next'
import { ISoeknad } from '../../context/soknad/soknad'
import { IBruker } from '../../context/bruker/bruker'
import {
    AnnenInntekt,
    AnnenSituasjon,
    ArbeidOgUtdanning,
    Arbeidssoeker,
    Arbeidstaker,
    BetingetOpplysning,
    DatoSvar,
    EndringAvInntekt,
    EnumSvar,
    EtablererVirksomhet,
    ForholdTilAvdoede,
    ForholdTilAvdoedeType,
    FritekstSvar,
    HoeyesteUtdanning,
    InntektOgPensjon,
    JaNeiVetIkke,
    Kontaktinfo,
    Loennsinntekt,
    NaeringsinntektGjenlevende,
    OppholdUtland,
    Opplysning,
    PensjonEllerUfoere,
    SelvstendigNaeringsdrivende,
    SivilstatusType,
    Stoenader,
    TilbudOmJobb,
    Utdanning,
    YtelserAndre,
    YtelserNav,
} from '../dto/FellesOpplysninger'
import { Gjenlevende, PersonType, Samboer } from '../dto/Person'
import { valgTilSvar } from './fellesMapper'
import { IForholdAvdoede, INySivilstatus, ISituasjonenDin, Sivilstatus } from '../../typer/person'
import { IValg } from '../../typer/Spoersmaal'
import { IMerOmSituasjonenDin, JobbStatus } from '../../typer/situasjon'
import {
    konverterEndringAvInntektGrunn,
    konverterIngenJobb,
    konverterInntektEllerUtbetaling,
    konverterJobbStatus,
    konverterPensjonEllerTrygd,
    konverterPensjonsYtelse,
    konverterRelasjonAvdoed,
    konverterSagtOppEllerRedusert,
    konverterSivilstatus,
    konverterSoekteYtelserAndre,
    konverterSoekteYtelserNAV,
    konverterStillingType,
    konverterStudieform,
    konverterTilHoyesteUtdanning,
} from './typeMapper'
import { fullAdresse } from '../../utils/adresse'
import { IngenJobb, ISelvstendigNaeringsdrivende, StillingType } from '../../typer/arbeidsforhold'
import {
    EndringAvInntektGrunn,
    IForventerEndringAvInntekt,
    IInntekt,
    InntektEllerUtbetaling,
    InntektsTyper,
    PensjonEllerTrygd,
} from '../../typer/inntekt'

export const mapGjenlevende = (t: TFunction, soeknad: ISoeknad, bruker: IBruker): Gjenlevende => {
    const kontaktinfo: Kontaktinfo = {
        telefonnummer: {
            spoersmaal: bruker.telefonnummer ? t('felles.telefonnummer') : t('omDeg.kontaktinfo.telefonnummer'),
            svar: {
                innhold: bruker.telefonnummer || soeknad.omDeg.kontaktinfo!!.telefonnummer || '-',
            },
        },
    }

    const flyktning = !!soeknad.omDeg.flyktning
        ? {
              spoersmaal: t('omDeg.flyktning'),
              svar: valgTilSvar(t, soeknad.omDeg.flyktning),
          }
        : undefined

    // TODO: Slå sammen med ArbeidOgUtdanning ... ?
    const fullfoertUtdanning: Opplysning<EnumSvar<HoeyesteUtdanning>[]> | undefined = !bruker.adressebeskyttelse
        ? {
              spoersmaal: t('merOmSituasjonenDin.utdanning.hoyesteFullfoerteUtdanning'),
              svar:
                  soeknad.merOmSituasjonenDin.utdanning!!.hoyesteFullfoerteUtdanning!!.map((type) => ({
                      verdi: konverterTilHoyesteUtdanning(type),
                      innhold: t(type),
                  })) || [],
          }
        : undefined

    return {
        type: PersonType.GJENLEVENDE,

        fornavn: {
            spoersmaal: t('felles.fornavn'),
            svar: bruker.fornavn!!,
        },
        etternavn: {
            spoersmaal: t('felles.etternavn'),
            svar: bruker.etternavn!!,
        },
        foedselsnummer: {
            spoersmaal: t('felles.foedselsnummer'),
            svar: bruker.foedselsnummer!!,
        },

        statsborgerskap: {
            spoersmaal: t('felles.statsborgerskap'),
            svar: `${bruker.statsborgerskap}`,
        },
        sivilstatus: {
            spoersmaal: t('felles.sivilstatus'),
            svar: t(`pdl.sivilstatus.${bruker.sivilstatus}`) || `${bruker.sivilstatus}`,
        },

        adresse: !bruker.adressebeskyttelse
            ? {
                  spoersmaal: t('felles.adresse'),
                  svar: fullAdresse(bruker),
              }
            : undefined,
        bostedsAdresse:
            !bruker.adressebeskyttelse && soeknad.omDeg.alternativAdresse
                ? {
                      spoersmaal: t('omDeg.alternativAdresse'),
                      svar: {
                          innhold: soeknad.omDeg.alternativAdresse!!,
                      },
                  }
                : undefined,
        kontaktinfo,
        flyktning,
        oppholdUtland: !bruker.adressebeskyttelse ? hentOppholdUtland(t, soeknad.situasjonenDin) : undefined,
        nySivilstatus: hentSivilstatus(t, soeknad.situasjonenDin.nySivilstatus!!),
        arbeidOgUtdanning: !bruker.adressebeskyttelse
            ? hentArbeidOgUtdanning(t, soeknad.merOmSituasjonenDin)
            : undefined,
        fullfoertUtdanning,
        inntektOgPensjon: hentInntektOgPensjon(t, soeknad.inntektenDin),
        uregistrertEllerVenterBarn: {
            spoersmaal: t('situasjonenDin.gravidEllerNyligFoedt'),
            svar: valgTilSvar(t, soeknad.situasjonenDin.gravidEllerNyligFoedt!!),
        },
        forholdTilAvdoede: mapForholdTilAvdoede(t, soeknad.omDegOgAvdoed.forholdTilAvdoede!!),
        omsorgForBarn: {
            spoersmaal: t('situasjonenDin.omsorgMinstFemti'),
            svar: valgTilSvar(t, soeknad.situasjonenDin.omsorgMinstFemti!!)
        }
    }
}

export const mapStoenader = (t: TFunction, soeknad: ISoeknad): Opplysning<EnumSvar<Stoenader>>[] => {
    const stoenader: Opplysning<EnumSvar<Stoenader>>[] = []

    if (soeknad.merOmSituasjonenDin.utdanning?.soeknadOmSkolepenger) {
        stoenader.push({
            spoersmaal: t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger'),
            svar: {
                innhold: t('merOmSituasjonenDin.utdanning.soeknadOmSkolepenger.bekreftelse'),
                verdi: Stoenader.SKOLEPENGER,
            },
        })
    }

    if (soeknad.merOmSituasjonenDin.utdanning?.soeknadOmTilleggsstoenadUtdanning) {
        stoenader.push({
            spoersmaal: t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning'),
            svar: {
                innhold: t('merOmSituasjonenDin.utdanning.soeknadOmTilleggsstoenadUtdanning.bekreftelse'),
                verdi: Stoenader.TILLEGGSSTOENAD_UTDANNING,
            },
        })
    }

    if (soeknad.opplysningerOmBarn.soeknadOmBarnetilsyn) {
        stoenader.push({
            spoersmaal: t('omBarn.soeknadOmBarnetilsyn'),
            svar: {
                innhold: t('omBarn.soeknadOmBarnetilsyn.bekreftelse'),
                verdi: Stoenader.BARNETILSYN,
            },
        })
    }

    if (soeknad.opplysningerOmBarn.soeknadOmTilleggsstoenadBarnepass) {
        stoenader.push({
            spoersmaal: t('omBarn.soeknadOmTilleggsstoenadBarnepass'),
            svar: {
                innhold: t('omBarn.soeknadOmTilleggsstoenadBarnepass.bekreftelse'),
                verdi: Stoenader.TILLEGGSSTOENAD_BARNEPASS,
            },
        })
    }

    return stoenader
}

const hentOppholdUtland = (
    t: TFunction,
    situasjonenDin: ISituasjonenDin
): BetingetOpplysning<EnumSvar<JaNeiVetIkke>, OppholdUtland> => {
    let opplysning: OppholdUtland | undefined

    if (situasjonenDin.bosattINorge === IValg.JA) {
        opplysning = {
            oppholderSegIUtlandet: {
                spoersmaal: t('situasjonenDin.oppholderSegIUtlandet'),
                svar: valgTilSvar(t, situasjonenDin.oppholderSegIUtlandet!!.svar!!),
            },
            oppholdsland: situasjonenDin.oppholderSegIUtlandet!!.svar!! === IValg.NEI ? {
                spoersmaal: t('situasjonenDin.oppholderSegIUtlandet.oppholdsland'),
                svar: {
                    innhold: situasjonenDin.oppholderSegIUtlandet!!.oppholdsland!!,
                },
            } : undefined,
            oppholdFra: situasjonenDin.oppholderSegIUtlandet!!.oppholdFra
                ? {
                      spoersmaal: t('situasjonenDin.oppholderSegIUtlandet.oppholdFra'),
                      svar: {
                          innhold: situasjonenDin.oppholderSegIUtlandet!!.oppholdFra!!,
                      },
                  }
                : undefined,
            oppholdTil: situasjonenDin.oppholderSegIUtlandet!!.oppholdTil
                ? {
                      spoersmaal: t('situasjonenDin.oppholderSegIUtlandet.oppholdTil'),
                      svar: {
                          innhold: situasjonenDin.oppholderSegIUtlandet!!.oppholdTil!!,
                      },
                  }
                : undefined,
        }
    }

    if (situasjonenDin.bosattINorge === IValg.NEI) {
        opplysning = {
            bosattLand: {
                spoersmaal: t('situasjonenDin.bosattLand'),
                svar: {
                    innhold: situasjonenDin.bosattLand!!,
                },
            },
        }
    }

    return {
        spoersmaal: t('situasjonenDin.bosattINorge'),
        svar: valgTilSvar(t, situasjonenDin.bosattINorge!!),
        opplysning,
    }
}

const hentSivilstatus = (
    t: TFunction,
    nySivilstatus: INySivilstatus
): BetingetOpplysning<EnumSvar<SivilstatusType>, Samboer> => {
    let opplysning: Samboer | undefined

    if (nySivilstatus?.sivilstatus == Sivilstatus.samboerskap) {
        const samboer = nySivilstatus.samboerskap!!.samboer!!

        opplysning = {
            type: PersonType.SAMBOER,
            fornavn: {
                spoersmaal: t('felles.fornavn'),
                svar: samboer.fornavn!!,
            },
            etternavn: {
                spoersmaal: t('felles.etternavn'),
                svar: samboer.etternavn!!,
            },
            foedselsnummer: {
                spoersmaal: t('felles.foedselsnummer'),
                svar: samboer.foedselsnummer!!,
            },
            fellesBarnEllertidligereGift: {
                spoersmaal: t('omDegOgAvdoed.nySivilstatus.samboerskap.hattBarnEllerVaertGift'),
                svar: valgTilSvar(t, nySivilstatus.samboerskap!!.hattBarnEllerVaertGift!!), // TODO: Korrigere type
            },
        }
    }

    return {
        spoersmaal: t('omDegOgAvdoed.nySivilstatus.sivilstatus'),
        svar: {
            verdi: konverterSivilstatus(nySivilstatus!!.sivilstatus!!),
            innhold: t(nySivilstatus!!.sivilstatus!!),
        },
        opplysning,
    }
}

const hentArbeidOgUtdanning = (t: TFunction, dinSituasjon: IMerOmSituasjonenDin): ArbeidOgUtdanning => {
    let arbeidsforhold: Opplysning<Arbeidstaker[]> | undefined

    if (dinSituasjon.jobbStatus?.includes(JobbStatus.arbeidstaker)) {
        arbeidsforhold = {
            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.tittel'),
            svar:
                dinSituasjon.arbeidsforhold?.map((arbeid) => {
                    const arbeidstaker: Arbeidstaker = {
                        arbeidsgiver: {
                            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.arbeidsgiver'),
                            svar: {
                                innhold: arbeid.arbeidsgiver!!,
                            },
                        },
                        arbeidsmengde:
                            arbeid.ansettelsesforhold === StillingType.fast
                                ? {
                                      spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar.fast'),
                                      svar: {
                                          innhold: `${arbeid.arbeidsmengde!!.svar!!} ${t('felles.prosent')}`,
                                      },
                                  }
                                : {
                                      spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar'),
                                      svar: {
                                          innhold: `${arbeid.arbeidsmengde!!.svar!!} ${t(
                                              arbeid.arbeidsmengde!!.type!!
                                          )}`,
                                      },
                                  },
                        ansettelsesforhold: {
                            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold'),
                            svar: {
                                verdi: konverterStillingType(arbeid.ansettelsesforhold!!),
                                innhold: t(arbeid.ansettelsesforhold!!),
                            },
                        },
                        harSluttdato:
                            arbeid?.ansettelsesforhold === StillingType.midlertidig ||
                            arbeid?.ansettelsesforhold === StillingType.tilkallingsvikar
                                ? {
                                      spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.midlertidig.svar'),
                                      svar: valgTilSvar(t, arbeid!!.midlertidig!!.svar!!),
                                  }
                                : undefined,
                        sluttdato:
                            arbeid?.midlertidig?.svar === IValg.JA
                                ? {
                                      spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.midlertidig.sluttdatoVelger'),
                                      svar: {
                                          innhold: arbeid!!.midlertidig!!.sluttdatoVelger!!,
                                      },
                                  }
                                : undefined,
                        endretArbeidssituasjon: {
                            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.svar'),
                            svar: valgTilSvar(t, arbeid.forventerEndretArbeidssituasjon!!.svar!!), // TODO: fikse type,
                            opplysning:
                                arbeid.forventerEndretArbeidssituasjon?.svar === IValg.JA
                                    ? {
                                          spoersmaal: t(
                                              'merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.beskrivelse'
                                          ),
                                          svar: {
                                              innhold: t(arbeid.forventerEndretArbeidssituasjon.beskrivelse!!),
                                          },
                                      }
                                    : undefined,
                        },
                        sagtOppEllerRedusert: {
                            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.sagtOppEllerRedusert.svar'),
                            svar: {
                                verdi: konverterSagtOppEllerRedusert(arbeid.sagtOppEllerRedusert!!.svar!!),
                                innhold: t(arbeid.sagtOppEllerRedusert!!.svar!!),
                            },
                        },
                    }

                    return arbeidstaker
                }) || [],
        }
    }

    let selvstendigENK: Opplysning<SelvstendigNaeringsdrivende[]> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.selvstendigENK)) {
        const naeringListeENK: SelvstendigNaeringsdrivende[] =
            dinSituasjon.selvstendig?.enk?.map((naering) => {
                return mapSelvstendigNæringsdrivende(t, naering)
            }) || []

        selvstendigENK = {
            spoersmaal: t('merOmSituasjonenDin.selvstendig.enk.tittel'),
            svar: naeringListeENK,
        }
    }

    let selvstendigAS: Opplysning<SelvstendigNaeringsdrivende[]> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.selvstendigAS)) {
        const naeringListeAS: SelvstendigNaeringsdrivende[] =
            dinSituasjon.selvstendig?.as?.map((naering) => {
                return mapSelvstendigNæringsdrivende(t, naering)
            }) || []

        selvstendigAS = {
            spoersmaal: t('merOmSituasjonenDin.selvstendig.as.tittel'),
            svar: naeringListeAS,
        }
    }

    let etablererVirksomhet: Opplysning<EtablererVirksomhet> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.etablerer)) {
        etablererVirksomhet = {
            spoersmaal: t('merOmSituasjonenDin.etablererVirksomhet.tittel'),
            svar: {
                virksomheten: {
                    spoersmaal: t('merOmSituasjonenDin.etablererVirksomhet.hvaHeterVirksomheten'),
                    svar: {
                        innhold: dinSituasjon.etablererVirksomhet!!.hvaHeterVirksomheten!!,
                    },
                },
                orgnr: {
                    spoersmaal: t('merOmSituasjonenDin.etablererVirksomhet.orgnr'),
                    svar: {
                        innhold: dinSituasjon.etablererVirksomhet?.manglerOrgnr?.length
                            ? dinSituasjon.etablererVirksomhet.manglerOrgnr[0]
                            : dinSituasjon.etablererVirksomhet!!.orgnr!!,
                    },
                },
                forretningsplan: {
                    spoersmaal: t('merOmSituasjonenDin.etablererVirksomhet.forretningsplan.svar'),
                    svar: valgTilSvar(t, dinSituasjon.etablererVirksomhet!!.forretningsplan!!.svar!!),
                },
                samarbeidMedNav:
                    dinSituasjon.etablererVirksomhet?.forretningsplan?.svar === IValg.JA
                        ? {
                              spoersmaal: t(
                                  'merOmSituasjonenDin.etablererVirksomhet.forretningsplan.samarbeidMedNAV.svar'
                              ),
                              svar: valgTilSvar(
                                  t,
                                  dinSituasjon!!.etablererVirksomhet!!.forretningsplan!!.samarbeidMedNAV!!.svar!!
                              ),
                          }
                        : undefined,
            },
        }
    }

    let tilbud: Opplysning<TilbudOmJobb> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.tilbud)) {
        const fastAnsettelse = dinSituasjon.tilbudOmJobb?.ansettelsesforhold === StillingType.fast

        tilbud = {
            spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.tittel'),
            svar: {
                nyttArbeidssted: {
                    spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.arbeidssted'),
                    svar: {
                        innhold: dinSituasjon.tilbudOmJobb!!.arbeidssted!!,
                    },
                },
                ansettelsesdato: {
                    spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesdato'),
                    svar: {
                        innhold: dinSituasjon!!.tilbudOmJobb!!.ansettelsesdato!!,
                    },
                },
                ansettelsesforhold: {
                    spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold'),
                    svar: {
                        verdi: konverterStillingType(dinSituasjon.tilbudOmJobb!!.ansettelsesforhold!!),
                        innhold: t(dinSituasjon.tilbudOmJobb!!.ansettelsesforhold!!),
                    },
                },
                arbeidsmengde: fastAnsettelse
                    ? {
                          spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.arbeidsmengde.svar.fast'),
                          svar: {
                              innhold: `${dinSituasjon.tilbudOmJobb!!.arbeidsmengde!!.svar!!} ${t('felles.prosent')}`,
                          },
                      }
                    : {
                          spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.arbeidsmengde.svar'),
                          svar: {
                              innhold: `${dinSituasjon.tilbudOmJobb!!.arbeidsmengde!!.svar!!} ${t(
                                  dinSituasjon.tilbudOmJobb!!.arbeidsmengde!!.type!!
                              )}`,
                          },
                      },
                harSluttdato:
                    dinSituasjon.tilbudOmJobb?.ansettelsesforhold === StillingType.midlertidig ||
                    dinSituasjon.tilbudOmJobb?.ansettelsesforhold === StillingType.tilkallingsvikar
                        ? {
                              spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.midlertidig.svar'),
                              svar: valgTilSvar(t, dinSituasjon.tilbudOmJobb!!.midlertidig!!.svar!!),
                          }
                        : undefined,
                sluttdato:
                    dinSituasjon.tilbudOmJobb?.midlertidig?.svar === IValg.JA
                        ? {
                              spoersmaal: t('merOmSituasjonenDin.tilbudOmJobb.midlertidig.sluttdatoVelger'),
                              svar: {
                                  innhold: dinSituasjon!!.tilbudOmJobb!!.midlertidig!!.sluttdatoVelger!!,
                              },
                          }
                        : undefined,
            },
        }
    }

    let arbeidssoeker: Opplysning<Arbeidssoeker> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.arbeidssoeker)) {
        arbeidssoeker = {
            spoersmaal: t('merOmSituasjonenDin.arbeidssoeker.tittel'),
            svar: {
                registrertArbeidssoeker: {
                    spoersmaal: t('merOmSituasjonenDin.arbeidssoeker.svar'),
                    svar: valgTilSvar(t, dinSituasjon.arbeidssoeker!!.svar!!),
                },
                aktivitetsplan:
                    dinSituasjon.arbeidssoeker!!.svar === IValg.JA
                        ? {
                              spoersmaal: t('merOmSituasjonenDin.arbeidssoeker.aktivitetsplan.svar'),
                              svar: valgTilSvar(t, dinSituasjon.arbeidssoeker!!.aktivitetsplan.svar!!),
                          }
                        : undefined,
            },
        }
    }

    let utdanning: Opplysning<Utdanning> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.underUtdanning)) {
        utdanning = {
            spoersmaal: t('merOmSituasjonenDin.utdanning.tittel'),
            svar: {
                studiested: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studiested'),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.studiested!!,
                    },
                },
                studie: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studie'),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.studie!!,
                    },
                },
                studieform: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieform'),
                    svar: {
                        innhold: t(dinSituasjon.utdanning!!.naavaerendeUtdanning!!.studieform!!),
                        verdi: konverterStudieform(dinSituasjon.utdanning!!.naavaerendeUtdanning!!.studieform!!),
                    },
                },
                studieprosent: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.studieprosent'),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.studieprosent!!,
                    },
                },
                startDato: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.startDato'),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.startDato!!,
                    },
                },
                sluttDato: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.sluttDato'),
                    svar: {
                        innhold: dinSituasjon.utdanning!!.naavaerendeUtdanning!!.sluttDato!!,
                    },
                },
                godkjentUtdanning: {
                    spoersmaal: t('merOmSituasjonenDin.utdanning.naavaerendeUtdanning.godkjentUtdanning'),
                    svar: valgTilSvar(t, dinSituasjon.utdanning!!.naavaerendeUtdanning!!.godkjentUtdanning!!),
                },
            },
        }
    }

    let annenSituasjon: Opplysning<AnnenSituasjon> | undefined
    if (dinSituasjon.jobbStatus?.includes(JobbStatus.ingen)) {
        annenSituasjon = {
            spoersmaal: t('merOmSituasjonenDin.annenSituasjon.tittel'),
            svar: {
                beskrivelse: {
                    spoersmaal: t('merOmSituasjonenDin.annenSituasjon.beskrivelse'),
                    svar: {
                        innhold: t(dinSituasjon.annenSituasjon!!.beskrivelse!!),
                        verdi: konverterIngenJobb(dinSituasjon.annenSituasjon!!.beskrivelse!!),
                    },
                },
                annet:
                    dinSituasjon.annenSituasjon!!.beskrivelse === IngenJobb.annet
                        ? {
                              spoersmaal: t('merOmSituasjonenDin.selvstendig.forventerEndretInntekt.beskrivelse'),
                              svar: {
                                  innhold: `${dinSituasjon.annenSituasjon!!.annet!!.beskrivelse}`,
                              },
                          }
                        : undefined,
            },
        }
    }

    return {
        dinSituasjon: {
            spoersmaal: t('merOmSituasjonenDin.jobbStatus'),
            svar:
                dinSituasjon.jobbStatus?.map((type) => ({
                    verdi: konverterJobbStatus(type),
                    innhold: t(type),
                })) || [],
        },
        arbeidsforhold,
        selvstendigENK,
        selvstendigAS,
        etablererVirksomhet,
        tilbud,
        arbeidssoeker,
        utdanning,
        annenSituasjon,
    }
}

const hentInntektOgPensjon = (t: TFunction, inntektenDin: IInntekt): InntektOgPensjon => {
    let loennsinntekt: Opplysning<Loennsinntekt> | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.loenn)) {
        loennsinntekt = {
            spoersmaal: t('inntektenDin.loennsinntekt.tittel'),
            svar: {
                arbeidsinntektAaretFoer: {
                    spoersmaal: t('inntektenDin.loennsinntekt.arbeidsinntektAaretFoer'),
                    svar: {
                        innhold: inntektenDin.loennsinntekt!!.arbeidsinntektAaretFoer!!,
                    },
                },
                arbeidsinntektIAar: {
                    tilDoedsfall: {
                        spoersmaal: t('inntektenDin.loennsinntekt.arbeidsinntektIAar.tilDoedsfall'),
                        svar: {
                            innhold: inntektenDin.loennsinntekt!!.arbeidsinntektIAar!!.tilDoedsfall!!,
                        },
                    },
                    etterDoedsfall: {
                        spoersmaal: t('inntektenDin.loennsinntekt.arbeidsinntektIAar.etterDoedsfall'),
                        svar: {
                            innhold: inntektenDin.loennsinntekt!!.arbeidsinntektIAar!!.etterDoedsfall!!,
                        },
                    },
                },
                endringAvInntekt: mapEndringAvInntekt(t, inntektenDin.loennsinntekt!!.forventerEndringAvInntekt),
            },
        }
    }

    let naeringsinntekt: Opplysning<NaeringsinntektGjenlevende> | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.naering)) {
        naeringsinntekt = {
            spoersmaal: t('inntektenDin.naeringsinntekt.tittel'),
            svar: {
                arbeidsinntektAaretFoer: {
                    spoersmaal: t('inntektenDin.naeringsinntekt.arbeidsinntektAaretFoer'),
                    svar: {
                        innhold: inntektenDin.naeringsinntekt!!.arbeidsinntektAaretFoer!!,
                    },
                },
                arbeidsinntektIAar: {
                    tilDoedsfall: {
                        spoersmaal: t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.tilDoedsfall'),
                        svar: {
                            innhold: inntektenDin.naeringsinntekt!!.arbeidsinntektIAar!!.tilDoedsfall!!,
                        },
                    },
                    etterDoedsfall: {
                        spoersmaal: t('inntektenDin.naeringsinntekt.arbeidsinntektIAar.etterDoedsfall'),
                        svar: {
                            innhold: inntektenDin.naeringsinntekt!!.arbeidsinntektIAar!!.etterDoedsfall!!,
                        },
                    },
                },
                endringAvInntekt: mapEndringAvInntekt(t, inntektenDin.naeringsinntekt!!.forventerEndringAvInntekt),
            },
        }
    }

    let pensjonEllerUfoere: PensjonEllerUfoere | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.pensjonEllerUfoere)) {
        const pensjonFraUtland = inntektenDin.pensjonEllerUfoere!!.utland!!.svar === IValg.JA

        pensjonEllerUfoere = {
            pensjonstype: {
                spoersmaal: t('inntektenDin.pensjonEllerUfoere.pensjonstype'),
                svar: inntektenDin.pensjonEllerUfoere!!.pensjonstype!!.map((ytelse) => ({
                    verdi: konverterPensjonEllerTrygd(ytelse),
                    innhold: t(ytelse),
                })),
            },
            tjenestepensjonsordning: inntektenDin.pensjonEllerUfoere!!.pensjonstype!!.includes(
                PensjonEllerTrygd.tjenestepensjonsordning
            )
                ? {
                      type: {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.type'),
                          svar: {
                              verdi: konverterPensjonsYtelse(
                                  inntektenDin.pensjonEllerUfoere!!.tjenestepensjonsordning!!.type
                              ),
                              innhold: t(inntektenDin.pensjonEllerUfoere!!.tjenestepensjonsordning!!.type),
                          },
                      },
                      utbetaler: {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.utbetaler'),
                          svar: {
                              innhold: inntektenDin.pensjonEllerUfoere!!.tjenestepensjonsordning!!.utbetaler,
                          },
                      },
                  }
                : undefined,
            utland: {
                svar: {
                    spoersmaal: t('inntektenDin.pensjonEllerUfoere.utland.svar'),
                    svar: valgTilSvar(t, inntektenDin.pensjonEllerUfoere!!.utland!!.svar),
                },
                type: pensjonFraUtland
                    ? {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.utland.type'),
                          svar: {
                              innhold: inntektenDin.pensjonEllerUfoere!!.utland!!.type!!,
                          },
                      }
                    : undefined,
                land: pensjonFraUtland
                    ? {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.utland.land'),
                          svar: {
                              innhold: inntektenDin.pensjonEllerUfoere!!.utland!!.land!!,
                          },
                      }
                    : undefined,
                beloepMedValuta: pensjonFraUtland
                    ? {
                          spoersmaal: t('inntektenDin.pensjonEllerUfoere.utland.beloep'),
                          svar: {
                              innhold: `${inntektenDin.pensjonEllerUfoere!!.utland!!
                                  .beloep!!} ${inntektenDin.pensjonEllerUfoere!!.utland!!.valuta!!}`,
                          },
                      }
                    : undefined,
            },
        }
    }

    let annenInntekt: AnnenInntekt | undefined
    if (inntektenDin.inntektstyper?.includes(InntektsTyper.annen)) {
        annenInntekt = {
            annenInntektEllerUtbetaling: {
                spoersmaal: t('inntektenDin.annenInntekt.inntektEllerUtbetaling'),
                svar: inntektenDin.annenInntekt!!.inntektEllerUtbetaling!!.map((ytelse) => ({
                    verdi: konverterInntektEllerUtbetaling(ytelse),
                    innhold: t(ytelse),
                })),
            },
            beloep: inntektenDin.annenInntekt!!.inntektEllerUtbetaling!!.includes(InntektEllerUtbetaling.annen)
                ? {
                      spoersmaal: t('inntektenDin.annenInntekt.beloep'),
                      svar: {
                          innhold: inntektenDin.annenInntekt!!.beloep!!,
                      },
                  }
                : undefined,
        }
    }

    const ytelserNAV: YtelserNav = {
        soektOmYtelse: {
            spoersmaal: t('inntektenDin.ytelserNAV.svar'),
            svar: valgTilSvar(t, inntektenDin.ytelserNAV!!.svar!!),
        },
        soektYtelse:
            inntektenDin.ytelserNAV!!.svar!! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.ytelserAndre.soekteYtelser'),
                      svar: inntektenDin.ytelserNAV!!.soekteYtelser!!.map((ytelse) => ({
                          verdi: konverterSoekteYtelserNAV(ytelse),
                          innhold: t(ytelse),
                      })),
                  }
                : undefined,
    }

    const ytelserAndre: YtelserAndre = {
        soektOmYtelse: {
            spoersmaal: t('inntektenDin.ytelserAndre.svar'),
            svar: valgTilSvar(t, inntektenDin.ytelserAndre!!.svar!!),
        },
        soektYtelse:
            inntektenDin.ytelserAndre!!.svar!! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.ytelserAndre.soekteYtelser'),
                      svar: inntektenDin.ytelserAndre!!.soekteYtelser!!.map((ytelse) => ({
                          verdi: konverterSoekteYtelserAndre(ytelse),
                          innhold: t(ytelse),
                      })),
                  }
                : undefined,
        pensjonsordning:
            inntektenDin.ytelserAndre!!.svar!! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.ytelserAndre.pensjonsordning'),
                      svar: {
                          innhold: inntektenDin.ytelserAndre!!.pensjonsordning!!,
                      },
                  }
                : undefined,
    }

    return {
        loennsinntekt,
        naeringsinntekt,
        pensjonEllerUfoere,
        annenInntekt,
        ytelserNAV,
        ytelserAndre,
    }
}

const mapForholdTilAvdoede = (t: TFunction, forholdTilAvdoede: IForholdAvdoede): ForholdTilAvdoede => {
    const relasjon: Opplysning<EnumSvar<ForholdTilAvdoedeType>> = {
        spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.relasjon'),
        svar: {
            verdi: konverterRelasjonAvdoed(forholdTilAvdoede.relasjon!!),
            innhold: t(forholdTilAvdoede.relasjon!!),
        },
    }

    const datoForInngaattPartnerskap: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForInngaattPartnerskap
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap'),
              svar: {
                  innhold: forholdTilAvdoede.datoForInngaattPartnerskap,
              },
          }
        : undefined

    const datoForSkilsmisse: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForSkilsmisse
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.datoForSkilsmisse'),
              svar: {
                  innhold: forholdTilAvdoede.datoForSkilsmisse,
              },
          }
        : undefined

    const samboereMedFellesBarnFoerGiftemaal: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined =
        !!forholdTilAvdoede.samboereMedFellesBarn
            ? {
                  spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.samboereMedFellesBarn'),
                  svar: valgTilSvar(t, forholdTilAvdoede.samboereMedFellesBarn),
              }
            : undefined

    const datoForInngaattSamboerskap: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForInngaattSamboerskap
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap'),
              svar: {
                  innhold: forholdTilAvdoede.datoForInngaattSamboerskap,
              },
          }
        : undefined

    const datoForSamlivsbrudd: Opplysning<DatoSvar> | undefined = !!forholdTilAvdoede.datoForSamlivsbrudd
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.datoForSamlivsbrudd'),
              svar: {
                  innhold: forholdTilAvdoede.datoForSamlivsbrudd,
              },
          }
        : undefined

    const fellesBarn: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.fellesBarn
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn'),
              svar: valgTilSvar(t, forholdTilAvdoede.fellesBarn),
          }
        : undefined

    const tidligereGift: Opplysning<EnumSvar<JaNeiVetIkke>> | undefined = !!forholdTilAvdoede.tidligereGift
        ? {
              spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.tidligereGift'),
              svar: valgTilSvar(t, forholdTilAvdoede.tidligereGift),
          }
        : undefined

    const mottokBidrag: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<FritekstSvar> | undefined> | undefined =
        !!forholdTilAvdoede.mottokBidrag
            ? {
                  spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag'),
                  svar: valgTilSvar(t, forholdTilAvdoede.mottokBidrag.svar),
                  opplysning:
                      forholdTilAvdoede.mottokBidrag?.svar === IValg.JA
                          ? {
                                spoersmaal: t('omDegOgAvdoed.forholdTilAvdoede.mottokBidrag.sum'),
                                svar: {
                                    innhold: `${forholdTilAvdoede.mottokBidrag?.sum}`,
                                },
                            }
                          : undefined,
              }
            : undefined

    return {
        relasjon,
        datoForInngaattSamboerskap,
        datoForInngaattPartnerskap,
        datoForSkilsmisse,
        datoForSamlivsbrudd,
        fellesBarn,
        samboereMedFellesBarnFoerGiftemaal,
        tidligereGift,
        mottokBidrag,
    }
}

const mapSelvstendigNæringsdrivende = (
    t: TFunction,
    selvstendig: ISelvstendigNaeringsdrivende
): SelvstendigNaeringsdrivende => {
    return {
        firmanavn: {
            spoersmaal: t('merOmSituasjonenDin.selvstendig.tittel'),
            svar: {
                innhold: selvstendig.beskrivelse!!,
            },
        },
        orgnr: {
            spoersmaal: t('merOmSituasjonenDin.selvstendig.orgnr'),
            svar: {
                innhold: selvstendig.orgnr!!,
            },
        },
        arbeidsmengde: {
            spoersmaal: t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar'),
            svar: {
                innhold: `${selvstendig!!.arbeidsmengde!!.svar!!} ${t(selvstendig!!.arbeidsmengde!!.type!!)}`,
            },
        },
        endretArbeidssituasjon: {
            spoersmaal: t('merOmSituasjonenDin.selvstendig.forventerEndretArbeidssituasjon.svar'),
            svar: valgTilSvar(t, selvstendig.forventerEndretArbeidssituasjon!!.svar!!), // TODO: Fikse type
            opplysning:
                selvstendig.forventerEndretArbeidssituasjon?.svar === IValg.JA
                    ? {
                          spoersmaal: t('merOmSituasjonenDin.selvstendig.forventerEndretArbeidssituasjon.beskrivelse'),
                          svar: {
                              innhold: `${selvstendig.forventerEndretArbeidssituasjon?.beskrivelse}`,
                          },
                      }
                    : undefined,
        },
    }
}

const mapEndringAvInntekt = (t: TFunction, endringAvInntekt: IForventerEndringAvInntekt): EndringAvInntekt => {
    return {
        fremtidigEndringAvInntekt: {
            spoersmaal: t('inntektenDin.forventerEndringAvInntekt.svar'),
            svar: valgTilSvar(t, endringAvInntekt!!.svar!!),
        },
        grunn:
            endringAvInntekt!!.svar!! === IValg.JA
                ? {
                      spoersmaal: t('inntektenDin.forventerEndringAvInntekt.grunn'),
                      svar: {
                          verdi: konverterEndringAvInntektGrunn(endringAvInntekt!!.grunn!!),
                          innhold: t(endringAvInntekt!!.grunn!!),
                      },
                  }
                : undefined,
        annenGrunn:
            endringAvInntekt!!.grunn === EndringAvInntektGrunn.annenGrunn
                ? {
                      spoersmaal: t('inntektenDin.forventerEndringAvInntekt.annenGrunn'),
                      svar: {
                          innhold: endringAvInntekt!!.annenGrunn!!,
                      },
                  }
                : undefined,
    }
}
