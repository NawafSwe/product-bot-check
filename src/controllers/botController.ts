const {Telegraf, Markup, Extra} = require('telegraf')
import {NextFunction} from "express";
import TelegrafQuestion from "telegraf-question";

const LocalSession = require('telegraf-session-local');
import {BotQuires, BotCommands, AnswersQuires} from "../utilites/botQuires";

const bot = new Telegraf(process.env.TOKEN);

// config bot
// using session
bot.use((new LocalSession({database: 'health_db.json'})).middleware());
// using TelegrafQuestion to ask question and get answer back
bot.use(TelegrafQuestion({
    cancelTimeout: 300000 // 5 min
}));

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

    // starting check process
    bot.hears(BotCommands.doHealthCheck.name, async (fn: any, next: NextFunction) => {
        await fn.answerCbQuery();
        let chosen = 0;
        fn.replyWithHTML(`<i>let us do fast check for the product 👍🏻</i>`);

        let quality = await fn.ask(`Rate from 0 to 5`);
        if (quality == null) {
            return next();
        }
        console.log(`quality is ${quality}`);
        // fn.replyWithHTML(`<i>please rate the physical status from 1 to 5 </i>`, Markup.keyboard([
        //     Markup.button.callback(`${AnswersQuires.ratingQuality.zero.num}`, `${AnswersQuires.ratingQuality.zero.num}`),
        //     '2', '3', '4', '5'
        // ]));
    });


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

function quitBot() {
    // quitting the bot
    bot.command(BotCommands.quit, (fn: any) => {
        // Explicit usage
        fn.telegram.leaveChat(fn.message.chat.id);

        // Using context shortcut
        fn.leaveChat();
    });
}


