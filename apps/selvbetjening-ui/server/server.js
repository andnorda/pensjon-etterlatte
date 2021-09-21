const express = require("express");
const path = require("path");
const decorator = require("./decorator");
const authRoutes = require("./auth/auth-routes")
const api = require("./api");
const config = require("./config");

const buildPath = path.resolve(__dirname, "../build");
const basePath = config.app.basePath;
const app = express();

app.set("trust proxy", 1);
app.use(basePath, express.static(buildPath, { index: false }));

if (config.env.isLabs) {
    api.mock(app);
} else {
    authRoutes.setup(app);
    api.setup(app);
    decorator.setup(app, buildPath);
}

// Endpoints to verify is app is ready/alive
app.get(`/isAlive|isReady`, (req, res) => {
    res.sendStatus(200);
});

const port = config.app.port;
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
