/**
 * @module src/controllers/botController.ts
 * this module requires the following packages:
 * @requires Telegraf,Markup,Extra,TelegrafContext
 * @requires NextFunction
 * @requires TelegrafQuestion
 */

// importing dependencies
const {Telegraf, Markup, Extra, TelegrafContext} = require('telegraf')
import {NextFunction} from "express";
import TelegrafQuestion from "telegraf-question";
import {AnswersQuires, BotCommands, BotQuires} from "../utilites/botQuires";

const LocalSession = require('telegraf-session-local');
// creating bot
const bot = new Telegraf(process.env.TOKEN);

// config bot
// using session
bot.use((new LocalSession({database: 'health_db.json'})).middleware());
// using TelegrafQuestion to ask question and get answer back
bot.use(TelegrafQuestion({
    cancelTimeout: 300000 // 5 min
}));

/**
 * @function
 * @namespace initialStart
 * @description function that init the start of bot and lunch it to work
 */
export function initialStart() {
    // starting with wlecoming message
    bot.start((fn: any) => {
            fn.replyWithHTML(`${BotQuires.welcomingUser.query}`);
            fn.replyWithHTML(BotQuires.instructions);
        }
    );

    // init help command that contains sub actions
    bot.command('help', async (fn: any) => {
        await fn.replyWithHTML('<b>available commands</b>', Markup.inlineKeyboard(
            [
                Markup.button.callback(`${BotCommands.doHealthCheck.name}`, `do_check`),
                Markup.button.callback(`view session`, `session`),
                Markup.button.callback(`clear session`, `clear`)
            ]
            )
                .oneTime()
                .resize()
        )
    });
    // triggered after help
    // session actions

    // getting session data
    bot.action('session', async (fn: any) => {
        await getDataFromSession(fn);
    });

    // removing session data
    bot.action(`clear`, async (fn: any) => {
        await clearSession(fn);
    });

    // starting check process with asking the question about the product
    bot.action('do_check', async (fn: any, next: NextFunction) => {
        await fn.replyWithHTML(`<b>Rate quality of tracking the shipment from 0 to 5</b>`, Markup.inlineKeyboard([
            [
                Markup.button.callback(AnswersQuires.ratingQuality.zero.num, AnswersQuires.ratingQuality.zero.num),
                Markup.button.callback(AnswersQuires.ratingQuality.one.num, AnswersQuires.ratingQuality.one.num),
                Markup.button.callback(AnswersQuires.ratingQuality.two.num, AnswersQuires.ratingQuality.two.num),
                Markup.button.callback(AnswersQuires.ratingQuality.three.num, AnswersQuires.ratingQuality.three.num),
                Markup.button.callback(AnswersQuires.ratingQuality.four.num, AnswersQuires.ratingQuality.four.num),
                Markup.button.callback(AnswersQuires.ratingQuality.five.num, AnswersQuires.ratingQuality.five.num)
            ],
            [Markup.button.callback('cancel', 'cancel')]
        ]));


    });

    // action for user interaction after choosing rating
    // if he choose 0 or 1 or ... ect to 5
    bot.action(AnswersQuires.ratingQuality.zero.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.zero.num;
        checkPhysicalStatus(fn);
        return next();
    });

    bot.action(AnswersQuires.ratingQuality.one.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.one.num;
        await checkPhysicalStatus(fn);
        return next();
    });

    bot.action(AnswersQuires.ratingQuality.two.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.two.num;
        await checkPhysicalStatus(fn);
        return next();
    });
    bot.action(AnswersQuires.ratingQuality.three.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.three.num;
        await checkPhysicalStatus(fn);
        return next();
    });

    bot.action(AnswersQuires.ratingQuality.four.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.four.num;
        await checkPhysicalStatus(fn);
        return next();
    });

    bot.action(AnswersQuires.ratingQuality.five.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.five.num;
        await checkPhysicalStatus(fn);

        return next();
    });

    // if user had some problems with the physical status of the product or not

    bot.action('bad', async (fn: any, next: NextFunction) => {
        fn.session.physicalQuality = `bad`;
        // next
        await askForLocation(fn);
        return next();
    });

    bot.action('good', async (fn: any, next: NextFunction) => {
        fn.session.physicalQuality = `good`;
        // next
        await askForLocation(fn);
        return next();
    });

    // if user had bad experience with the delivery location or not
    bot.action('yes', async (fn: any, next: NextFunction) => {
        fn.session.locationDelivery = `Yes`;
        return next();
    });

    bot.action('no', async (fn: any, next: NextFunction) => {
        fn.session.locationDelivery = `No`;
        return next();
    });

    // if user want to cancel and quit
    bot.action(`cancel`, (_: any) => {
        quitBot();
    });

    // on receiving location or photo from user regarding product photo or deliveryLocation
    bot.on([`photo`, `location`], (fn: any) => {
        if (fn.message.photo) {
            fn.session.productPhoto = fn.message.photo;
        }

        if (fn.message.location) {
            fn.session.location = fn.message.location;
        }

    });

    // for fetching price when user type any number for the prouct price
    bot.on(`text`, (fn: any) => {
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

/* ----------------------Helper Functions ----------------------*/

/**
 * @function
 * @namespace quitBot
 * @description quit the bot and leave the chat
 */
function quitBot() {
    // quitting the bot
    bot.command(BotCommands.quit, (fn: any) => {
        // Explicit usage
        fn.telegram.leaveChat(fn.message.chat.id);
        fn.replyWithHTML(`<b>bye bye 👋🏻</b>`)
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

function checkPhysicalStatus(fn: any) {
    fn.replyWithHTML(`<b>How was the physical status of the product? before answering You can send photo of the current product 📷, and you can provide price </b>`, Markup.inlineKeyboard(
        [Markup.button.callback(`Good`, `good`), Markup.button.callback(`Bad`, 'bad')]
    ));
    // proceeding  to location


}

/**
 * @function
 * @namespace askForLocation
 *  * @param fn telegram context
 * @description asking user about the location
 */
function askForLocation(fn: any) {
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
async function getDataFromSession(fn: any) {
    let price = fn.session.price;
    let location = fn.session.location;
    let physicalQuality = fn.session.physicalQuality;
    let deliverySatisfaction = fn.session.locationDelivery;
    let trackShipmentQuality = fn.session.ratedQuality;
    await fn.replyWithHTML(`<b>overall quality rate: ${trackShipmentQuality}</b>`)
    await fn.replyWithHTML(`<b>delivery satisfaction : ${deliverySatisfaction} </b>`);
    await fn.replyWithHTML(`<b>price of the product: ${price == null ? `Not Given` : price}</b>`);
    await fn.replyWithHTML(`<b>product physical quality ${physicalQuality}</b>`)
    await fn.replyWithLocation(location.latitude, location.longitude);
    await fn.replyWithHTML(`<b>Sent photos of the product</b>`);
    if (fn.session.productPhoto) {
        for await(let photo of fn.session.productPhoto) {
            await fn.replyWithPhoto(photo.file_id);
        }
    } else {
        await fn.replyWithHTML(`<b>No Photos were found sorry 😓</b>`)
    }

}

/**
 * @async
 * @function
 * @namespace clearSession
 * @param fn telegram context
 * @description clear all the data stored in the session
 */
async function clearSession(fn: any) {
    await fn.replyWithMarkdown(`Removing session from database: \`${JSON.stringify(fn.session)}\``)
    fn.session = null;
}
