import { Feiloppsummering, SkjemaGruppe } from "nav-frontend-skjema";
import { TFunction, useTranslation } from "react-i18next";
import { FieldError, FieldErrors } from "react-hook-form/dist/types/errors";
import { FeiloppsummeringFeil } from "nav-frontend-skjema/src/feiloppsummering";
import { v4 as uuid } from "uuid";
import { getTransKey } from "../../utils/translation";

const getFieldErrors = (obj: FieldErrors): FieldError[] => {
    return Object.values(obj).flatMap((value?: any) => {
        if (!value) return undefined;
        if ((value as FieldError)?.type && typeof value.type !== "object") return value;
        else return getFieldErrors(value);
    });
};

export const konverterFeilmeldinger = (errors: FieldErrors, t: TFunction<"translation">): FeiloppsummeringFeil[] => {
    return getFieldErrors(errors)
        .filter((error) => !!error)
        .map((error) => {
            return {
                skjemaelementId: error.ref!!.name,
                feilmelding: t(getTransKey(error)),
            };
        });
};

const Feilmeldinger = ({ errors }: { errors: FieldErrors }) => {
    const { t } = useTranslation();

    return (
        <>
            {!!Object.keys(errors).length && (
                <SkjemaGruppe key={uuid()}>
                    <Feiloppsummering
                        tittel="For å gå videre må du rette opp følgende:"
                        feil={konverterFeilmeldinger(errors, t)}
                    />
                </SkjemaGruppe>
            )}
        </>
    );
};

export default Feilmeldinger;
