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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialStart = void 0;
const { Telegraf, Markup, Extra } = require('telegraf');
const LocalSession = require('telegraf-session-local');
const botQuires_1 = require("../utilites/botQuires");
const bot = new Telegraf(process.env.TOKEN);
bot.use((new LocalSession({ database: 'health_db.json' })).middleware());
function initQuires() {
    for (let q of botQuires_1.BotQuires.askUserHealth.firstQuires) {
        bot.hears(q, (fn, next) => {
            return fn.replyWithHTML('<i>Have a nice day 😊</i>').then(() => next());
        });
    }
    for (let q of botQuires_1.BotQuires.askUserHealth.secondQuires) {
        bot.hears(q, (fn, next) => {
            return fn.replyWithHTML('<i>sorry for that how can I help 😊</i>').then(() => next());
        });
    }
}
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
    bot.hears(botQuires_1.BotCommands.ratePhysical.name, (fn) => __awaiter(this, void 0, void 0, function* () {
        fn.replyWithHTML(`<b>opps ${botQuires_1.BotCommands.ratePhysical.name}</b> triggered`);
    }));
    bot.hears(botQuires_1.BotCommands.rateShipment.name, (fn) => __awaiter(this, void 0, void 0, function* () {
        fn.replyWithHTML(`<b>opps ${botQuires_1.BotCommands.rateShipment.name}</b> triggered`);
    }));
    // starting check process
    bot.hears(botQuires_1.BotCommands.doHealthCheck.name, (fn) => __awaiter(this, void 0, void 0, function* () {
        fn.replyWithHTML(`<i>let us do fast check for the product 👍🏻</i>`);
        fn.replyWithHTML(`<i>please rate the physical status from 1 to 5 </i>`, Markup.keyboard([
            '1', '2', '3', '4', '5'
        ]));
    }));
    // session saved after user response
    // bot.on(text)
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
