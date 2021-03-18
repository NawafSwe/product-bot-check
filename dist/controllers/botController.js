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
const { Telegraf, Markup, Extra } = require('telegraf');
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
    bot.hears('hello', (fn) => {
        fn.replyWithHTML(`${botQuires_1.BotQuires.welcomingUser.query}`);
        fn.replyWithHTML(botQuires_1.BotQuires.instructions);
    });
    // init help command
    bot.command('help', (fn) => __awaiter(this, void 0, void 0, function* () {
        yield fn.replyWithHTML('<b>available commands</b>', Markup.keyboard([
            [`${botQuires_1.BotCommands.ratePhysical.name}`, `${botQuires_1.BotCommands.rateShipment.name}`],
            [`${botQuires_1.BotCommands.quit.name}`, `${botQuires_1.BotCommands.doHealthCheck.name}`]
        ])
            .oneTime()
            .resize());
    }));
    // triggered after help
    // starting check process
    bot.hears(botQuires_1.BotCommands.doHealthCheck.name, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        yield fn.answerCbQuery();
        let chosen = 0;
        fn.replyWithHTML(`<i>let us do fast check for the product 👍🏻</i>`);
        let quality = yield fn.ask(`Rate from 0 to 5`);
        if (quality == null) {
            return next();
        }
        console.log(`quality is ${quality}`);
        // fn.replyWithHTML(`<i>please rate the physical status from 1 to 5 </i>`, Markup.keyboard([
        //     Markup.button.callback(`${AnswersQuires.ratingQuality.zero.num}`, `${AnswersQuires.ratingQuality.zero.num}`),
        //     '2', '3', '4', '5'
        // ]));
    }));
    // // session saved after user response
    // bot.on(`text`, (fn: any) => {
    //     fn.session.ratedQUality = fn.session.ratedQUality || 0;
    //
    // });
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
