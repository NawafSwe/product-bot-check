"use strict";
/**
 * @module src/controllers/botController.ts
 * this module requires the following packages:
 * @requires Telegraf,Markup,Extra,TelegrafContext
 * @requires NextFunction
 * @requires TelegrafQuestion
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialStart = void 0;
// importing dependencies
const { Telegraf, Markup, Extra, TelegrafContext } = require('telegraf');
const telegraf_question_1 = __importDefault(require("telegraf-question"));
const botQuires_1 = require("../utilites/botQuires");
const LocalSession = require("telegraf-session-local");
// creating bot
const bot = new Telegraf(process.env.TOKEN);
// config bot
// using session
bot.use((new LocalSession({ database: 'health_db.json' })).middleware());
// using TelegrafQuestion to ask question and get answer back
bot.use(telegraf_question_1.default({
    cancelTimeout: 300000 // 5 min
}));
/**
 * @function
 * @namespace initialStart
 * @description function that init the start of bot and lunch it to work
 */
function initialStart() {
    return __awaiter(this, void 0, void 0, function* () {
        // starting with welcoming message
        bot.start((fn) => __awaiter(this, void 0, void 0, function* () {
            yield fn.replyWithHTML(`${botQuires_1.BotQuires.welcomingUser.query}`);
            yield fn.replyWithHTML(botQuires_1.BotQuires.instructions);
            yield fn.replyWithHTML(`<b> to quit bot write /out</b>`);
        }));
        // init help command that contains sub actions
        bot.command('help', (fn) => __awaiter(this, void 0, void 0, function* () {
            yield fn.replyWithHTML('<b>available commands</b>', Markup.inlineKeyboard([
                Markup.button.callback(`${botQuires_1.BotCommands.doHealthCheck.name}`, `do_check`),
                Markup.button.callback(`view session`, `session`),
                Markup.button.callback(`clear session`, `clear`)
            ])
                .oneTime()
                .resize());
        }));
        // quit bot will be triggered when user type /quit
        bot.command('out', (fn) => __awaiter(this, void 0, void 0, function* () {
            yield quitBot(fn);
        }));
        // view session commands
        // triggered after help
        // session actions
        // getting session data
        bot.action('session', (fn) => __awaiter(this, void 0, void 0, function* () {
            yield getDataFromSession(fn);
        }));
        // removing session data
        bot.action(`clear`, (fn) => __awaiter(this, void 0, void 0, function* () {
            yield clearSession(fn);
        }));
        // starting check process with asking the question about the product
        bot.action('do_check', (fn, next) => __awaiter(this, void 0, void 0, function* () {
            yield fn.replyWithHTML(`<b>Rate quality of tracking the shipment from 0 to 5</b>`, Markup.inlineKeyboard([
                [
                    Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.zero.num, botQuires_1.AnswersQuires.ratingQuality.zero.num),
                    Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.one.num, botQuires_1.AnswersQuires.ratingQuality.one.num),
                    Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.two.num, botQuires_1.AnswersQuires.ratingQuality.two.num),
                    Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.three.num, botQuires_1.AnswersQuires.ratingQuality.three.num),
                    Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.four.num, botQuires_1.AnswersQuires.ratingQuality.four.num),
                    Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.five.num, botQuires_1.AnswersQuires.ratingQuality.five.num)
                ],
                [Markup.button.callback('cancel', 'cancel')]
            ]));
        }));
        // action for user interaction after choosing rating
        // if he choose 0 or 1 or ... ect to 5
        yield initChoices();
        // if user had some problems with the physical status of the product or not
        bot.action('upload', (fn, next) => __awaiter(this, void 0, void 0, function* () {
            fn.session.physicalQuality = `bad`;
            // next
            // await askForLocation(fn);
            return next();
        }));
        bot.action('good', (fn, next) => __awaiter(this, void 0, void 0, function* () {
            fn.session.physicalQuality = `good`;
            // next
            // await askForLocation(fn);
            return next();
        }));
        bot.action('uploadPhoto', (fn) => __awaiter(this, void 0, void 0, function* () {
            yield askForLocation(fn);
        }));
        bot.action(`skipPhoto`, (fn) => __awaiter(this, void 0, void 0, function* () {
            yield askForLocation(fn);
        }));
        // if user had bad experience with the delivery location or not
        bot.action('yes', (fn, next) => __awaiter(this, void 0, void 0, function* () {
            fn.session.locationDelivery = `Yes`;
            return next();
        }));
        bot.action('no', (fn, next) => __awaiter(this, void 0, void 0, function* () {
            fn.session.locationDelivery = `No`;
            return next();
        }));
        // if user want to cancel and quit
        bot.action(`cancel`, (fn) => __awaiter(this, void 0, void 0, function* () {
            yield quitBot(fn);
        }));
        // on receiving location or photo from user regarding product photo or deliveryLocation
        bot.on([`photo`, `location`], (fn) => {
            if (fn.message.photo) {
                fn.session.productPhoto = fn.message.photo;
            }
            if (fn.message.location) {
                fn.session.location = fn.message.location;
            }
        });
        // for fetching price when user type any number for the prouct price
        bot.on(`text`, (fn) => {
            if (typeof fn.message.text === 'number') {
                fn.session.price = parseFloat(fn.message.text);
            }
        });
        // lunching bot
        bot.launch();
        // Enable graceful stop
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    });
}
exports.initialStart = initialStart;
/* ----------------------Helper Functions ----------------------*/
/**
 * @function
 * @namespace quitBot
 * @description quit the bot and leave the chat
 */
function quitBot(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        // quitting the bot
        // Explicit usage
        yield fn.replyWithHTML(`<b>bye bye 👋🏻</b>`);
    });
}
/**
 * @function
 * @namespace checkPhysicalStatus
 * @param fn telegram context
 * @description asking user about the physical status of the product
 */
function checkPhysicalStatus(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fn.replyWithHTML(`<b>How was the physical status of the product? before answering You can send photo of the current product 📷, and you can provide price </b>`, Markup.inlineKeyboard([
            [Markup.button.callback(`Good`, `good`), Markup.button.callback(`Bad`, 'bad')],
            [Markup.button.callback('cancel', 'cancel')]
        ]));
        yield fn.replyWithHTML(`<b>Would like to provide a picture? if yes please send it and press okay if you would like to skip just press skip</b>`, Markup.inlineKeyboard([
            Markup.button.callback(`Okay`, 'uploadPhoto'),
            Markup.button.callback(`Skip`, `skipPhoto`),
        ]));
    });
}
/**
 * @function
 * @namespace askForLocation
 *  * @param fn telegram context
 * @description asking user about the location
 */
function askForLocation(fn) {
    fn.replyWithHTML(`<b>are you satisfied delivery location? you can provide the location of the delivery before answering 🧭</b>`, Markup.inlineKeyboard([
        [Markup.button.callback(`Yes`, `yes`), Markup.button.callback(`No`, `no`)],
        [Markup.button.callback('cancel', 'cancel')]
    ]));
}
/**
 * @async
 * @function
 * @namespace getDataFromSession
 * @param fn fn telegram context
 * @description getting stored data from session and send it to user
 */
function getDataFromSession(fn) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        let price = fn.session.price == null ? `Empty` : fn.session.price;
        let location = fn.session.location == null ? `Empty` : fn.session.location;
        let physicalQuality = fn.session.physicalQuality == null ? `Empty` : fn.session.physicalQuality;
        let deliverySatisfaction = fn.session.locationDelivery == null ? `Empty` : fn.session.locationDelivery;
        let trackShipmentQuality = fn.session.ratedQuality == null ? `Empty` : fn.session.ratedQuality;
        //displaying result to user
        yield fn.replyWithHTML(`<b>overall quality rate: ${trackShipmentQuality}</b>`);
        yield fn.replyWithHTML(`<b>delivery satisfaction : ${deliverySatisfaction} </b>`);
        yield fn.replyWithHTML(`<b>price of the product: ${price}</b>`);
        yield fn.replyWithHTML(`<b>product physical quality ${physicalQuality}</b>`);
        if (location == `Empty`) {
            yield fn.replyWithHTML(`<b>there is no location</b>`);
        }
        else {
            yield fn.replyWithLocation(location.latitude, location.longitude);
        }
        yield fn.replyWithHTML(`<b>Sent photos of the product</b>`);
        if (fn.session.productPhoto) {
            try {
                for (var _b = __asyncValues(fn.session.productPhoto), _c; _c = yield _b.next(), !_c.done;) {
                    let photo = _c.value;
                    yield fn.replyWithPhoto(photo.file_id);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            yield fn.replyWithHTML(`<b>No Photos were found sorry 😓</b>`);
        }
    });
}
/**
 * @async
 * @function
 * @namespace clearSession
 * @param fn telegram context
 * @description clear all the data stored in the session
 */
function clearSession(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fn.replyWithMarkdown(`Removing session from database: ${JSON.stringify(fn.session)}`);
        fn.session = null;
    });
}
function indicateFinish(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fn.replyWithHTML(`<b>Great We Finshed thank you for your feedback you can view the last operation you did by typing view session</b>`);
    });
}
function initChoices() {
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (var _b = __asyncValues(Object.entries(botQuires_1.AnswersQuires.ratingQuality)), _c; _c = yield _b.next(), !_c.done;) {
                let [_, value] = _c.value;
                bot.action(value.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
                    fn.session.ratedQuality = value.num;
                    yield checkPhysicalStatus(fn);
                    return next();
                }));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
function optionalPhoto(fn) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
