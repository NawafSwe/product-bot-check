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
exports.initialStart = void 0;
const { Telegraf, Markup, Extra, TelegrafContext } = require('telegraf');
const telegraf_question_1 = __importDefault(require("telegraf-question"));
const LocalSession = require('telegraf-session-local');
const botQuires_1 = require("../utilites/botQuires");
const bot = new Telegraf(process.env.TOKEN);
// config bot
// using session
bot.use((new LocalSession({ database: 'health_db.json' })).middleware());
// using TelegrafQuestion to ask question and get answer back
bot.use(telegraf_question_1.default({
    cancelTimeout: 300000 // 5 min
}));
function initialStart() {
    bot.start((fn) => {
        fn.replyWithHTML(`${botQuires_1.BotQuires.welcomingUser.query}`);
        fn.replyWithHTML(botQuires_1.BotQuires.instructions);
    });
    // init help command
    bot.command('help', (fn) => __awaiter(this, void 0, void 0, function* () {
        yield fn.replyWithHTML('<b>available commands</b>', Markup.inlineKeyboard([Markup.button.callback(`${botQuires_1.BotCommands.doHealthCheck.name}`, `do_check`),
            Markup.button.callback('1', '1'),
        ])
            .oneTime()
            .resize());
    }));
    // triggered after help
    // starting check process
    bot.action(`1`, (fn) => __awaiter(this, void 0, void 0, function* () {
        yield fn.answerCbQuery();
        let rate = yield fn.ask({
            text: `what it is your rating`,
            extra: {
                reply_markup: Markup.inlineKeyboard(['0'])
            }
        }, null, `rate`, (fn) => {
            var _a;
            let rate = parseInt((_a = fn.message) === null || _a === void 0 ? void 0 : _a.text);
            console.log(rate);
            return rate;
        });
        if (rate !== null) {
            console.log(rate);
        }
    }));
    bot.action('do_check', (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.replyWithHTML(`<b>Rate quality of tracking the shipment from 0 to 5</b>`, Markup.inlineKeyboard([
            [
                Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.zero.num, botQuires_1.AnswersQuires.ratingQuality.zero.num)
            ],
        ]));
    }));
    // action for user interaction after choosing rating
    // if he choose 0
    bot.action(botQuires_1.AnswersQuires.ratingQuality.zero.num, (fn) => __awaiter(this, void 0, void 0, function* () {
    }));
    // quit bot will be triggered when user type /quit
    quitBot();
    bot.launch();
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
exports.initialStart = initialStart;
function quitBot() {
    // quitting the bot
    bot.command(botQuires_1.BotCommands.quit, (fn) => {
        // Explicit usage
        fn.telegram.leaveChat(fn.message.chat.id);
        // Using context shortcut
        fn.leaveChat();
    });
}
// // session saved after user response
// bot.on(`text`, (fn: any) => {
//     fn.session.ratedQUality = fn.session.ratedQUality || 0;
//
// });
