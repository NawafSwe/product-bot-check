/**
 * @module src/index.ts
 * this module requires the following packages:
 * @requires express
 * @requires Request,Response,Application
 * @requires bodyParser
 * @requires cors
 * @requires helmet
 *
 */

// importing dependencies
const express = require('express');
import {Request, Response, Application} from 'express';
import bodyParser from "body-parser";
import cors = require('cors');
// increasing server security
import helmet = require('helmet');

const {PORT, HOST} = require("./config");
import {initialStart} from "./controllers/botController";
/* ------------ App Config ------------ */
const app: Application = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
// docs refers to the project documentation.
app.use(express.static("docs"));

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
    // rendering the docs page
    res.render(`docs`);
});
/* ------------ Start listening ------------ */
app.listen(PORT, HOST, () => {
    initialStart();
    console.log(`server running on  http://${HOST}:${PORT}`);
});
