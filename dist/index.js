"use strict";
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
const helmet = require("helmet");
//import morgan from "morgan";
const { PORT, HOST } = require("./config");
/* ------------ App Config ------------ */
const app = express();
app.use(express.json());
app.use(body_parser_1.default.json());
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
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Backend health is good').status(200);
}));
/* ------------ Using Routes ------------ */
const botRouter_1 = require("./routes/botRouter");
app.use('/bot', botRouter_1.router);
/* ------------ Start listening ------------ */
app.listen(PORT);
console.log(`server running on  http://${HOST}:${PORT}`);
