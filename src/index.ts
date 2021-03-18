// importing dependencies
const express = require('express');
import {Request, Response, Application} from 'express';
import bodyParser from "body-parser";
import cors = require('cors');
import helmet = require('helmet');
//import morgan from "morgan";

const {PORT, HOST} = require("./config");
/* ------------ App Config ------------ */
const app: Application = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
//app.use(morgan(`tiny`));


/* ------------ Testing Backend ------------ */

/**
 * Route getting doc page of this project.
 * @name get/
 * @function
 * @memberOf module: src/index.ts~route
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
app.get('/', async (req: Request, res: Response) => {
    res.send('Backend health is good').status(200);
});

/* ------------ Using Routes ------------ */
import {router as bootRoute} from "./routes/botRouter" ;

app.use('/bot', bootRoute);

/* ------------ Start listening ------------ */
app.listen(PORT);
console.log(`server running on  http://${HOST}:${PORT}`);
