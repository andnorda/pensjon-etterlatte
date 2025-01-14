import { RHFRadio, RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import { RHFInput, RHFNumberInput, RHFProsentInput } from '../../../felles/rhf/RHFInput'
import { useFormContext } from 'react-hook-form'
import { Detail, Heading, HGrid, RadioProps } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { Arbeidsmengde, StillingType } from '../../../../typer/arbeidsforhold'
import { IValg } from '../../../../typer/Spoersmaal'
import Datovelger from '../../../felles/Datovelger'
import Bredde from '../../../../typer/bredde'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'

const TilbudOmJobb = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const ansettelsesforhold = watch('tilbudOmJobb.ansettelsesforhold')
    const sluttdato = watch('tilbudOmJobb.midlertidig.svar')

    const arbeidsmengdeValg = Object.values(Arbeidsmengde).map((value) => {
        return { label: t(value), value }
    })

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('merOmSituasjonenDin.tilbudOmJobb.tittel')}</Heading>
            </SkjemaElement>

            <SkjemaElement>
                <RHFInput
                    name={'tilbudOmJobb.arbeidssted'}
                    label={t('merOmSituasjonenDin.tilbudOmJobb.arbeidssted')}
                    htmlSize={Bredde.M}
                />
            </SkjemaElement>

            <SkjemaGruppe>
                <Datovelger
                    name={`tilbudOmJobb.ansettelsesdato`}
                    label={t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesdato')}
                    minDate={new Date()}
                />
            </SkjemaGruppe>

            <SkjemaElement>
                <RHFRadio
                    name={`tilbudOmJobb.ansettelsesforhold` as const}
                    legend={t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold')}
                >
                    {Object.values(StillingType).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                </RHFRadio>
            </SkjemaElement>

            {ansettelsesforhold === StillingType.fast && (
                <SkjemaElement>
                    <SkjemaElement>
                        <Heading size={'xsmall'}>
                            {t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold.tittel')}
                        </Heading>
                        <Detail>{t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold.beskrivelse.fast')}</Detail>
                    </SkjemaElement>
                    <RHFProsentInput
                        name={`tilbudOmJobb.arbeidsmengde.svar` as const}
                        label={t('merOmSituasjonenDin.tilbudOmJobb.arbeidsmengde.svar.fast')}
                        htmlSize={Bredde.XS}
                    />
                </SkjemaElement>
            )}

            {(ansettelsesforhold === StillingType.midlertidig ||
                ansettelsesforhold === StillingType.tilkallingsvikar) && (
                <SkjemaElement>
                    <SkjemaElement>
                        <Heading size={'xsmall'}>
                            {t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold.tittel')}
                        </Heading>
                        <Detail>
                            {t('merOmSituasjonenDin.tilbudOmJobb.ansettelsesforhold.beskrivelse.midlertidig')}
                        </Detail>
                    </SkjemaElement>
                    <SkjemaElement>
                        <HGrid
                            columns={{ xs: 1, sm: 'repeat(auto-fit, minmax(8rem, 10rem))' }}
                            gap={'4'}
                            align={'start'}
                        >
                            <RHFNumberInput
                                name={`tilbudOmJobb.arbeidsmengde.svar` as const}
                                label={t('merOmSituasjonenDin.tilbudOmJobb.arbeidsmengde.svar')}
                            />
                            <RHFSelect
                                name={`tilbudOmJobb.arbeidsmengde.type` as const}
                                selectOptions={[
                                    {
                                        label: t('felles.velg'),
                                        value: '',
                                    },
                                ].concat(arbeidsmengdeValg)}
                                label={t('felles.velg.tittel')}
                            />
                        </HGrid>
                    </SkjemaElement>
                    <SkjemaElement>
                        <RHFSpoersmaalRadio
                            name={`tilbudOmJobb.midlertidig.svar` as const}
                            legend={t('merOmSituasjonenDin.tilbudOmJobb.midlertidig.svar')}
                        />
                    </SkjemaElement>
                    {sluttdato === IValg.JA && (
                        <Datovelger
                            name={`tilbudOmJobb.midlertidig.sluttdatoVelger`}
                            label={t('merOmSituasjonenDin.tilbudOmJobb.midlertidig.sluttdatoVelger')}
                            minDate={new Date()}
                        />
                    )}
                </SkjemaElement>
            )}
        </SkjemaGruppe>
    )
}

export default TilbudOmJobb
