import { SkjemaGruppe } from "nav-frontend-skjema";
import { FormProvider, useForm } from "react-hook-form";
import { Hovedknapp } from "nav-frontend-knapper";
import { useTranslation } from "react-i18next";
import { BarnRelasjon, IBarn } from "../../../typer/person";
import { RHFRadio, RHFToValgRadio } from "../../felles/RHFRadio";
import { RHFInput, RHFKontonummerInput } from "../../felles/RHFInput";
import { IValg } from "../../../typer/Spoersmaal";
import Feilmeldinger from "../../felles/Feilmeldinger";

interface Props {
    lagre: (data: IBarn) => void;
}

const LeggTilBarnSkjema = ({ lagre }: Props) => {
    const { t } = useTranslation();

    const methods = useForm<IBarn>({
        shouldUnregister: true
    });

    const {
        formState: { errors },
        handleSubmit,
        reset,
        watch,
    } = methods;

    const leggTilOgLukk = (data: any) => {
        lagre(data);
        reset();
    };

    const bosattUtland = watch("bosattUtland.svar")
    const brukeAnnenKonto = watch("brukeAnnenKonto.svar")


    return (
        <FormProvider {...methods}>
            <form style={{ padding: "2rem 2.5rem" }}>
                <SkjemaGruppe>
                    <RHFInput
                        name={"fornavn"}
                        label={t("omBarn.fornavn")}
                        rules={{ pattern: /^\D+$/ }}
                    />

                    <RHFInput
                        name={"etternavn"}
                        label={t("omBarn.etternavn")}
                        rules={{ pattern: /^\D+$/ }}
                    />

                    <RHFInput
                        name={"foedselsnummer"}
                        label={t("omBarn.foedselsnummer")}
                    />
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"brukeAnnenKonto.svar"}
                        legend={t("omBarn.brukeAnnenKonto.svar")}
                    />

                    {brukeAnnenKonto === IValg.JA && (
                        <RHFKontonummerInput
                            name={"brukeAnnenKonto.kontonummer"}
                            label={t("omBarn.brukeAnnenKonto.kontonummer")}
                        />
                    )}
                </SkjemaGruppe>

                <RHFRadio
                    name={"foreldre"}
                    legend={t("omBarn.relasjon")}
                    radios={[
                        {
                            label: t("omBarn.fellesbarnMedAvdoed"),
                            value: BarnRelasjon.fellesbarnMedAvdoede
                        },
                        {
                            label: t("omBarn.avdoedesSaerkullsbarn"),
                            value: BarnRelasjon.avdoedesSaerkullsbarn
                        },
                        { label: t("omBarn.egneSaerkullsbarn"), value: BarnRelasjon.egneSaerkullsbarn },
                    ]}
                />

                <SkjemaGruppe>
                    <RHFToValgRadio
                        name={"bosattUtland.svar"}
                        legend={t("omBarn.bosattUtland.svar")}
                    />

                    {bosattUtland === IValg.JA && (
                        <>
                            <RHFInput
                                name={"bosattUtland.statsborgerskap"}
                                label={t("omBarn.bosattUtland.statsborgerskap")}
                            />

                            <RHFInput
                                name={"bosattUtland.land"}
                                label={t("omBarn.bosattUtland.land")}
                            />
                        </>
                    )}
                </SkjemaGruppe>

                <Feilmeldinger errors={errors}/>

                <SkjemaGruppe className={"navigasjon-rad"}>
                    <Hovedknapp htmlType={"button"} onClick={handleSubmit(leggTilOgLukk)}>
                        {t("knapp.leggTil")}
                    </Hovedknapp>
                </SkjemaGruppe>
            </form>
        </FormProvider>
    );
};

export default LeggTilBarnSkjema;
