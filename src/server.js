const express = require('express')
const mainRouter = require("./routes/surveyRoutes");

const app = express();

app.use(express.json());
app.use("/surveys", mainRouter);

app.listen(3000);
