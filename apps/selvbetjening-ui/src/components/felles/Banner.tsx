import React from 'react';
import { Innholdstittel } from 'nav-frontend-typografi';

const bannerStyle = {
    width: "100%",
    height: "max-content",
    padding: "0.5rem 1rem 0.5rem 1rem",
    display: "flex",
    borderBottom: "4px solid #826ba1",
    backgroundColor: "#c1b5d0",
    alignItems: "center",
    justifyContent: "center",
}

const Banner = ({ tekst }: { tekst: string }) => {
    return (
        <header style={bannerStyle}>
            <Innholdstittel>
                {tekst}
            </Innholdstittel>
        </header>
    );
};

export default Banner;