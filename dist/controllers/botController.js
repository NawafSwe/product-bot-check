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
const LocalSession = require('telegraf-session-local');
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
    // starting with wlecoming message
    bot.start((fn) => {
        fn.replyWithHTML(`${botQuires_1.BotQuires.welcomingUser.query}`);
        fn.replyWithHTML(botQuires_1.BotQuires.instructions);
    });
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
    bot.action(botQuires_1.AnswersQuires.ratingQuality.zero.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.zero.num;
        checkPhysicalStatus(fn);
        return next();
    }));
    bot.action(botQuires_1.AnswersQuires.ratingQuality.one.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.one.num;
        yield checkPhysicalStatus(fn);
        return next();
    }));
    bot.action(botQuires_1.AnswersQuires.ratingQuality.two.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.two.num;
        yield checkPhysicalStatus(fn);
        return next();
    }));
    bot.action(botQuires_1.AnswersQuires.ratingQuality.three.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.three.num;
        yield checkPhysicalStatus(fn);
        return next();
    }));
    bot.action(botQuires_1.AnswersQuires.ratingQuality.four.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.four.num;
        yield checkPhysicalStatus(fn);
        return next();
    }));
    bot.action(botQuires_1.AnswersQuires.ratingQuality.five.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.five.num;
        yield checkPhysicalStatus(fn);
        return next();
    }));
    // if user had some problems with the physical status of the product or not
    bot.action('bad', (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.physicalQuality = `bad`;
        // next
        yield askForLocation(fn);
        return next();
    }));
    bot.action('good', (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.physicalQuality = `good`;
        // next
        yield askForLocation(fn);
        return next();
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
    bot.action(`cancel`, (_) => {
        quitBot();
    });
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
        if (fn.message.text) {
            fn.session.price = parseFloat(fn.message.text);
        }
    });
    // quit bot will be triggered when user type /quit
    quitBot();
    // lunching bot
    bot.launch();
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
exports.initialStart = initialStart;
/* ----------------------Helper Functions ----------------------*/
/**
 * @function
 * @namespace quitBot
 * @description quit the bot and leave the chat
 */
function quitBot() {
    // quitting the bot
    bot.command(botQuires_1.BotCommands.quit, (fn) => {
        // Explicit usage
        fn.telegram.leaveChat(fn.message.chat.id);
        fn.replyWithHTML(`<b>bye bye 👋🏻</b>`);
        // Using context shortcut
        fn.leaveChat();
    });
}
/**
 * @function
 * @namespace checkPhysicalStatus
 * @param fn telegram context
 * @description asking user about the physical status of the product
 */
function checkPhysicalStatus(fn) {
    fn.replyWithHTML(`<b>How was the physical status of the product? before answering You can send photo of the current product 📷, and you can provide price </b>`, Markup.inlineKeyboard([Markup.button.callback(`Good`, `good`), Markup.button.callback(`Bad`, 'bad')]));
    // proceeding  to location
}
/**
 * @function
 * @namespace askForLocation
 *  * @param fn telegram context
 * @description asking user about the location
 */
function askForLocation(fn) {
    fn.replyWithHTML(`<b>are you satisfied delivery location? you can provide the location of the delivery before answering 🧭</b>`, Markup.inlineKeyboard([
        Markup.button.callback(`Yes`, `yes`), Markup.button.callback(`No`, `no`)
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
        let price = fn.session.price;
        let photos = fn.session.productPhoto;
        let location = fn.session.location;
        let physicalQuality = fn.session.physicalQuality;
        let deliverySatisfaction = fn.session.locationDelivery;
        let trackShipmentQuality = fn.session.ratedQuality;
        //await fn.replyWithMarkdown(`data from your session: \`${JSON.stringify(fn.session)}\``);
        yield fn.replyWithHTML(`<b>overall quality rate: ${trackShipmentQuality}</b>`);
        yield fn.replyWithHTML(`<b>delivery satisfaction : ${deliverySatisfaction} </b>`);
        yield fn.replyWithHTML(`<b>price of the product: ${price == null ? `Not Given` : price}</b>`);
        yield fn.replyWithLocation(location.latitude, location.longitude);
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
        yield fn.replyWithMarkdown(`Removing session from database: \`${JSON.stringify(fn.session)}\``);
        fn.session = null;
    });
}
