import { useEffect } from "react";
import { Route, useRouteMatch } from "react-router";
import Stegindikator from "nav-frontend-stegindikator/lib/stegindikator";
import { useStegContext } from "../../context/steg/StegContext";
import { useHistory } from "react-router-dom";
import { StegActionTypes } from "../../context/steg/steg";
import { Hovedknapp, Knapp } from "nav-frontend-knapper";
import { Panel } from "nav-frontend-paneler";
import { useTranslation } from "react-i18next";

const SoknadDialog = () => {
    const history = useHistory();

    const { t } = useTranslation();
    const { path } = useRouteMatch();

    const { state, dispatch } = useStegContext();

    const { aktivtSteg, steg } = state;

    useEffect(() => {
        history.push(`/soknad/steg/${aktivtSteg}`);
    }, [history, aktivtSteg]);

    const forrige = () => dispatch({ type: StegActionTypes.FORRIGE });
    const neste = () => {
        if (aktivtSteg !== steg.length) {
            dispatch({ type: StegActionTypes.NESTE });
        } else {
            // TODO: Side for "ferdig søknad"
        }
    };

    const alleSteg = steg.map(({ disabled }, index) => {
        return {
            index,
            label: `${index}`, // TODO: Legge til label
            disabled,
        };
    });

    return (
        <>
            {aktivtSteg && (
                <Stegindikator
                    aktivtSteg={aktivtSteg - 1}
                    steg={alleSteg}
                    onChange={(index) => {
                        history.push(`${path}/steg/${index + 1}`);
                    }}
                />
            )}

            {state.steg.map((steg, index) => {
                const stegNr = index + 1;

                return (
                    <Route key={index} path={`${path}/${stegNr}`}>
                        <Panel>
                            <steg.component />
                        </Panel>
                    </Route>
                );
            })}

            <section className={"navigasjon-rad"}>
                {aktivtSteg > 1 && <Knapp onClick={forrige}>{t("knapp.tilbake")}</Knapp>}

                {aktivtSteg < steg.length && <Hovedknapp onClick={neste}>{t("knapp.neste")}</Hovedknapp>}

                {aktivtSteg === steg.length && (
                    <Hovedknapp onClick={() => history.push("/soknad/oppsummering")}>
                        {t("knapp.tilOppsummering")}
                    </Hovedknapp>
                )}
            </section>
        </>
    );
};

export default SoknadDialog;
