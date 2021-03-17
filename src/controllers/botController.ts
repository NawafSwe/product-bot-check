const {Telegraf, Markup, Extra} = require('telegraf')
import {NextFunction} from "express";
import {BotQuires} from "../utilites/botQuires";

const bot = new Telegraf(process.env.BOT_API);

function initQuires() {
    for (let q of BotQuires.askUserHealth.firstQuires) {
        bot.hears(q, (fn: any, next: NextFunction) => {
            return fn.replyWithHTML('<i>Have a nice day 😊</i>').then(() => next());
        });
    }

    for (let q of BotQuires.askUserHealth.secondQuires) {
        bot.hears(q, (fn: any, next: NextFunction) => {
            return fn.replyWithHTML('<i>sorry for that how can I help 😊</i>').then(() => next());
        });
    }
}

export function initialStart() {
    bot.start((fn: any) => {
            fn.replyWithHTML(`${BotQuires.welcomingUser.query}`);
            fn.replyWithHTML(BotQuires.instructions);
        }
    );

    bot.hears('hello', (fn: any) => {
        fn.replyWithHTML(BotQuires.askUserHealth.query, Markup.keyboard([
                Markup.button.callback(BotQuires.askUserHealth.firstChoice, BotQuires.askUserHealth.firstChoice.toLowerCase()),
                Markup.button.callback(BotQuires.askUserHealth.secondChoice, BotQuires.askUserHealth.secondChoice.toLowerCase())
            ])
        )
    });
    initQuires();
    bot.launch();

// Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

function quitBot() {
    // quitting the bot
    bot.command('quit', (fn: any) => {
        // Explicit usage
        fn.telegram.leaveChat(fn.message.chat.id);

        // Using context shortcut
        fn.leaveChat();
    });


}


