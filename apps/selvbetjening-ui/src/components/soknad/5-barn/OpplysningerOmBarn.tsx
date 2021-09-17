import React, { useState } from "react";
import "../../felles/Infokort.scss";
import ikon from "../../../assets/ikoner/barn1.svg";
import SoknadSteg from "../../../typer/SoknadSteg";
import { useSoknadContext } from "../../../context/soknad/SoknadContext";
import { IBarn, IOmBarn } from "../../../typer/person";
import { ActionTypes } from "../../../context/soknad/soknad";
import { useTranslation } from "react-i18next";
import BarnInfokort from "./BarnInfokort";
import LeggTilBarnSkjema from "./LeggTilBarnSkjema";
import { SkjemaGruppe } from "nav-frontend-skjema";
import { v4 as uuid } from "uuid";
import Navigasjon from "../../felles/Navigasjon";
import { Alert, BodyShort, Button, Modal, Panel, Title } from "@navikt/ds-react";
import { FieldArrayWithId, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { RHFSpoersmaalRadio } from "../../felles/RHFRadio";
import useEffectOnce from "../../../hooks/useEffectOnce";
import { isEmpty } from "lodash";

Modal.setAppElement!!("#root");

const OpplysningerOmBarn: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation();
    const { state, dispatch } = useSoknadContext();

    const methods = useForm<IOmBarn>({
        defaultValues: state.opplysningerOmBarn || {}
    });

    useEffectOnce(() => {
        methods.reset(state.opplysningerOmBarn)
    }, !isEmpty(state.opplysningerOmBarn));

    const { fields, append, remove } = useFieldArray({
        name: "barn",
        control: methods.control
    });

    // Modal
    const [isOpen, setIsOpen] = useState(false);

    const leggTilBarn = (data: IBarn) => {
        append(data as any)
        setIsOpen(false);
    };

    const lagre = (data: IOmBarn) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_BARN, payload: data });
        neste!!();
    }

    const { handleSubmit } = methods;

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaGruppe>
                    <Title size={"m"} className={"center"}>
                        {t("omBarn.tittel")}
                    </Title>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Panel border>
                        <Alert variant={"info"} className={"navds-alert--inline"}>
                            <BodyShort size={"s"}>
                                {t("omBarn.informasjon")}
                            </BodyShort>
                        </Alert>
                    </Panel>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <div className={"infokort-wrapper"}>
                        {fields?.map((field: FieldArrayWithId, index: number) => (
                            <BarnInfokort
                                key={uuid()}
                                barn={field as IBarn}
                                index={index}
                                fjern={remove}
                            />
                        ))}

                        <div className={"infokort"}>
                            <div className={"infokort__header gjennomsiktig"}>
                                <img alt="barn" className="barneikon" src={ikon} />
                            </div>
                            <div className={"infokort__informasjonsboks"}>
                                <div className={"informasjonsboks-innhold"}>
                                    <Button
                                        variant={"primary"}
                                        type={"button"}
                                        onClick={() => setIsOpen(true)}>
                                        {t("knapp.leggTilBarn")}
                                    </Button>
                                </div>

                                <BodyShort size={"s"} className={"center mute"}>
                                    {t("omBarn.valgfritt")}
                                </BodyShort>
                            </div>
                        </div>
                    </div>

                    <Modal
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                        className={"modal"}
                    >
                        <LeggTilBarnSkjema lagre={leggTilBarn} avbryt={() => setIsOpen(false)} />
                    </Modal>
                </SkjemaGruppe>

                <RHFSpoersmaalRadio
                    name={"gravidEllerNyligFoedt"}
                    legend={t("omBarn.gravidEllerNyligFoedt")}
                />

                <Navigasjon
                    forrige={{ onClick: forrige }}
                    neste={{ onClick: handleSubmit(lagre) }}
                />
            </form>
        </FormProvider>
    );
};

export default OpplysningerOmBarn;
