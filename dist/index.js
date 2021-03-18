"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importing dependencies
const express = require('express');
const body_parser_1 = __importDefault(require("body-parser"));
const cors = require("cors");
// increasing server security
const helmet = require("helmet");
const { PORT, HOST } = require("./config");
const botController_1 = require("./controllers/botController");
/* ------------ App Config ------------ */
const app = express();
app.use(express.json());
app.use(body_parser_1.default.json());
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
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // rendering the docs page
    res.render(`docs`);
}));
/* ------------ Start listening ------------ */
app.listen(PORT, HOST, () => {
    console.log(`server running on  http://${HOST}:${PORT}`);
});
botController_1.initialStart();
