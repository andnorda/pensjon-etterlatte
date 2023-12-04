import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSoknadContext } from '../../context/soknad/SoknadContext'
import { ActionTypes } from '../../context/soknad/soknad'
import {
    BodyLong,
    BodyShort,
    Button,
    ConfirmationPanel,
    ExpansionCard,
    GuidePanel,
    Heading,
    Link,
    List,
} from '@navikt/ds-react'
import { LogEvents, useAmplitude } from '../../utils/amplitude'
import { useLanguage } from '../../hooks/useLanguage'
import { Spraakvalg } from '../felles/Spraakvalg'
import { MuligeSteg } from '../../typer/steg'
import { SkjemaGruppe } from '../felles/SkjemaGruppe'
import { SkjemaElement } from '../felles/SkjemaElement'
import styled from 'styled-components'

const ListItemWithIndent = styled(List.Item)`
    margin-left: 1rem;
`

const SoknadForside = () => {
    const navigate = useNavigate()
    const { logEvent } = useAmplitude()
    const { t } = useTranslation()
    const { state: soknadState, dispatch: soknadDispatch } = useSoknadContext()
    useLanguage()

    const startSoeknad = () => {
        const foersteSteg = MuligeSteg[0]
        logEvent(LogEvents.AAPNE_SOKNAD)
        navigate(`/skjema/steg/${foersteSteg.path}`)
    }

    return (
        <>
            <SkjemaGruppe>
                <GuidePanel poster>{t('forside.ingress')}</GuidePanel>
            </SkjemaGruppe>

            <Spraakvalg />

            <SkjemaGruppe>
                <Heading spacing size={'large'}>
                    {t('forside.tittel')}
                </Heading>

                <BodyLong>{t('forside.omYtelsene.innhold')}</BodyLong>

                <List size={'small'}>
                    <ListItemWithIndent>{t('forside.omYtelsene.innhold.li1')}</ListItemWithIndent>
                    <ListItemWithIndent>{t('forside.omYtelsene.innhold.li2')}</ListItemWithIndent>
                    <ListItemWithIndent>{t('forside.omYtelsene.innhold.li3')}</ListItemWithIndent>
                </List>

                <BodyLong>
                    {t('forside.omYtelsene.innhold.merOmOmstillingsstoenad')}
                    <Link href={t('forside.omYtelsene.lenkeGjenlevende.href')}>
                        {t('forside.omYtelsene.lenkeGjenlevende.tekst')}
                    </Link>
                </BodyLong>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={'small'}>{t('forside.barnepensjon.tittel')}</Heading>

                <BodyLong spacing>{t('forside.barnepensjon.innhold')}</BodyLong>

                <ExpansionCard aria-label={t('forside.omSoeknaden.personvern')}>
                    <ExpansionCard.Header>
                        <ExpansionCard.Title as={'h2'}>{t('forside.omSoeknaden.personvern')}</ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>
                        <Heading size={'small'}>{t('forside.uthentingAvInfo.tittel')}</Heading>
                        <BodyLong>{t('forside.uthentingAvInfo.innhold')}</BodyLong>

                        <List as={'ul'} size={'small'}>
                            <ListItemWithIndent>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: t('forside.uthentingAvInfo.innholdListe.li1'),
                                    }}
                                />
                            </ListItemWithIndent>
                            <ListItemWithIndent>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: t('forside.uthentingAvInfo.innholdListe.li2'),
                                    }}
                                />
                            </ListItemWithIndent>
                            <ListItemWithIndent>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: t('forside.uthentingAvInfo.innholdListe.li3'),
                                    }}
                                />
                            </ListItemWithIndent>
                            <ListItemWithIndent>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: t('forside.uthentingAvInfo.innholdListe.li4'),
                                    }}
                                />
                            </ListItemWithIndent>
                            <ListItemWithIndent>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: t('forside.uthentingAvInfo.innholdListe.li5'),
                                    }}
                                />
                            </ListItemWithIndent>
                            <ListItemWithIndent>
                                <BodyLong>{t('forside.uthentingAvInfo.innholdListe.li6')}</BodyLong>
                            </ListItemWithIndent>
                        </List>

                        <SkjemaElement>
                            <BodyLong>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: t('forside.personvern.aktivitetsplikt'),
                                    }}
                                />
                            </BodyLong>
                        </SkjemaElement>

                        <SkjemaElement>
                            <BodyShort>{t('forside.personvern.tredjeperson')}</BodyShort>

                            <List as={'ul'} size={'small'}>
                                <ListItemWithIndent>{t('forside.personvern.tredjeperson.li1')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('forside.personvern.tredjeperson.li2')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('forside.personvern.tredjeperson.li3')}</ListItemWithIndent>
                                <ListItemWithIndent>{t('forside.personvern.tredjeperson.li4')}</ListItemWithIndent>
                            </List>
                        </SkjemaElement>

                        <SkjemaElement>
                            <BodyLong>
                                {t('forside.personvern.innhold')}
                                <Link href={t('forside.personvern.href')}>{t('forside.personvern.tekst')}</Link>
                            </BodyLong>
                        </SkjemaElement>
                    </ExpansionCard.Content>
                </ExpansionCard>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Heading size={'small'} spacing>
                    {t('forside.samtykke.tittel')}
                </Heading>

                <BodyShort spacing>{t('forside.samtykke.innhold')}</BodyShort>

                <ConfirmationPanel
                    label={t('forside.samtykke.bekreftelse')}
                    checked={soknadState.harSamtykket}
                    onChange={(e) =>
                        soknadDispatch({
                            type: ActionTypes.OPPDATER_SAMTYKKE,
                            payload: (e.target as HTMLInputElement).checked,
                        })
                    }
                />
            </SkjemaGruppe>
            {soknadState.harSamtykket && !soknadState?.error && (
                <Button variant={'primary'} type={'button'} id={'start-soeknad'} onClick={startSoeknad}>
                    {t('forside.startSoeknad')}
                </Button>
            )}
        </>
    )
}

export default SoknadForside
