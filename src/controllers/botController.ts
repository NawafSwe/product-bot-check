const {Telegraf, Markup, Extra} = require('telegraf')
import {NextFunction} from "express";

const LocalSession = require('telegraf-session-local');
import {BotQuires, BotCommands, mappingBotCommands} from "../utilites/botQuires";

const bot = new Telegraf(process.env.TOKEN);
bot.use((new LocalSession({database: 'health_db.json'})).middleware())

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
        fn.replyWithHTML(`${BotQuires.welcomingUser.query}`);
        fn.replyWithHTML(BotQuires.instructions);

    });

    // init help command
    bot.command('help', async (fn: any) => {
        await fn.replyWithHTML('<b>available commands</b>', Markup.keyboard([
                [`${BotCommands.ratePhysical.name}`, `${BotCommands.rateShipment.name}`],
                [`${BotCommands.quit.name}`, `${BotCommands.doHealthCheck.name}`]
            ])
                .oneTime()
                .resize()
        )

    });
    // triggered after help
    bot.hears(BotCommands.ratePhysical.name, async (fn: any) => {
        fn.replyWithHTML(`<b>opps ${BotCommands.ratePhysical.name}</b> triggered`);
    });

    bot.hears(BotCommands.rateShipment.name, async (fn: any) => {
        fn.replyWithHTML(`<b>opps ${BotCommands.rateShipment.name}</b> triggered`);
    });

    // starting check process
    bot.hears(BotCommands.doHealthCheck.name, async (fn: any) => {
        fn.replyWithHTML(`<i>let us do fast check for the product 👍🏻</i>`);
        fn.replyWithHTML(`<i>please rate the physical status from 1 to 5 </i>`, Markup.keyboard([
            '1', '2', '3', '4', '5'
        ]));
    });

    // session saved after user response
    // bot.on(text)

    // quit bot will be triggered when user type /quit
    quitBot();
    bot.launch();

// Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

function quitBot() {
    // quitting the bot
    bot.command(BotCommands.quit, (fn: any) => {
        // Explicit usage
        fn.telegram.leaveChat(fn.message.chat.id);

        // Using context shortcut
        fn.leaveChat();
    });
}


