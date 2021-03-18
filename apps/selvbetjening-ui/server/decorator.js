const { injectDecoratorServerSide } = require("@navikt/nav-dekoratoren-moduler/ssr");

const loginServiceProps =
    process.env.NODE_ENV !== "production"
        ? {}
        : {
              enforceLogin: true,
              redirectToApp: true,
              level: "Level4",
          };

const props = {
    ...loginServiceProps,
    env: process.env.NODE_ENV,
    context: "privatperson",
    breadcrumbs: [
        {
            url: "https://www.nav.no/person/familie/soknad",
            title: "Søknad om etterlatteytelser",
            handleInApp: true,
        },
    ],
};

const getDecorator = (filePath) => injectDecoratorServerSide({ ...props, filePath });

module.exports = getDecorator;
