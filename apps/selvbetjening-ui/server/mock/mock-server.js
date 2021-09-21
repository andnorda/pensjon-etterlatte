const express = require("express");
const { mockApi } = require("./mock-api");

const app = express();

mockApi(app);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
