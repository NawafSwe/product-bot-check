const {Telegraf, Markup, Extra, TelegrafContext} = require('telegraf')
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

    // init help command
    bot.command('help', async (fn: any) => {
        await fn.replyWithHTML('<b>available commands</b>', Markup.inlineKeyboard(
            [Markup.button.callback(`${BotCommands.doHealthCheck.name}`, `do_check`),
                Markup.button.callback('1', '1'),
            ]
            )
                .oneTime()
                .resize()
        )

    });
    // triggered after help
    // starting check process
    bot.action('do_check', async (fn: any, next: NextFunction) => {
        fn.replyWithHTML(`<b>Rate quality of tracking the shipment from 0 to 5</b>`, Markup.inlineKeyboard([
            [
                Markup.button.callback(AnswersQuires.ratingQuality.zero.num, AnswersQuires.ratingQuality.zero.num)
            ],
            //[]
        ]));

    });
    // action for user interaction after choosing rating
    // if he choose 0
    bot.action(AnswersQuires.ratingQuality.zero.num, async (fn: any , next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.zero.num;
        return next();
    });

    bot.command('/stat',(fn:any)=>{
        fn.replyWithHTML(`database has ${fn.session.ratedQuality}`)
    })
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


// // session saved after user response
// bot.on(`text`, (fn: any) => {
//     fn.session.ratedQUality = fn.session.ratedQUality || 0;
//
// });
