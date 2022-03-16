import useTranslation from '../../../hooks/useTranslation'
import { RHFGeneralQuestionRadio } from '../../common/rhf/RHFRadio'
import { RHFValutaInput } from '../../common/rhf/RHFInput'
import FormElement from '../../common/FormElement'

export default function SelfEmploymentDetails() {
    const { t } = useTranslation('aboutTheDeceased')

    return (
        <>
            <FormElement>
                <RHFValutaInput
                    name={'selfEmplyment.selfEmplymentDetails.income'}
                    bredde={'L'}
                    valgfri
                    type="tel"
                    placeholder={t('incomeFromSelfEmploymentBeforeTaxes')}
                    label={t('incomeFromSelfEmployymentYearBeforeDeath')}
                />
            </FormElement>
            <FormElement>
                <RHFGeneralQuestionRadio
                    name={'selfEmplyment.selfEmplymentDetails.incomeAtDeath'}
                    legend={t('hadIncomeFromSelfEmployment')}
                    vetIkke
                />
            </FormElement>
        </>
    )
}
