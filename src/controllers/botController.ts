const {Telegraf, Markup, Extra} = require('telegraf')
import {NextFunction} from "express";
import {BotQuires} from "../utilites/botQuires";

const bot = new Telegraf(process.env.BOT_API);

export function initialStart() {
    bot.start((fn: any) => fn.replyWithHTML(`${BotQuires.welcomingUser.query}`));
    bot.hears('hello', (fn: any) => {
        fn.replyWithHTML(BotQuires.askUserHealth.query, Markup.keyboard([
                Markup.button.callback(BotQuires.askUserHealth.firstChoice, BotQuires.askUserHealth.firstChoice.toLowerCase()),
                Markup.button.callback(BotQuires.askUserHealth.secondChoice, BotQuires.askUserHealth.secondChoice.toLowerCase())
            ])
        )
    });

    bot.hears(`${BotQuires.askUserHealth.firstChoice}`, (fn: any, next: NextFunction) => {
        return fn.replyWithHTML('<i>Have a nice day 😊</i>').then(() => next());
    });

    bot.hears(`${BotQuires.askUserHealth.secondChoice}`, (fn: any, next: NextFunction) => {
        return fn.replyWithHTML('<i>May happiness be with you 🙏</i>').then(() => next());
    });


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


