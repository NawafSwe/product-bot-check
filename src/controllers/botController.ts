/**
 * @module src/controllers/botController.ts
 * this module requires the following packages:
 * @requires Telegraf,Markup,Extra,TelegrafContext
 * @requires NextFunction
 * @requires TelegrafQuestion
 */


// importing dependencies
const {Telegraf, Markup, Extra, TelegrafContext} = require('telegraf');

import {NextFunction} from "express";
import TelegrafQuestion from "telegraf-question";
import {Context} from "telegraf/typings/context";
import {AnswersQuires, BotCommands, BotQuires} from "../utilites/botQuires";
import LocalSession = require('telegraf-session-local');

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
export async function initialStart() {
    // starting with welcoming message
    bot.start(async (fn: Context) => {
            await fn.replyWithHTML(`${BotQuires.welcomingUser.query}`);
            await fn.replyWithHTML(`<b>Available Commands press /commands</b>`);
        }
    );
    // shows available commands
    bot.command(BotCommands.commands.name, async (fn: Context) => await fn.replyWithHTML(BotQuires.availableCommands));
    // init help command that contains sub actions
    bot.command('help', async (fn: Context) => {
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

    // quit bot will be triggered when user type /quit
    bot.command('out', async (fn: Context) => {
        await quitBot(fn);
    });


    // view session commands
    bot.command(BotCommands.viewSession.name, async (fn: Context) => await getDataFromSession(fn));
    bot.command(BotCommands.clearSession.name, async (fn: Context) => await clearSession(fn));

    // triggered after help
    // session actions

    // getting session data
    bot.action('session', async (fn: Context) => {
        await getDataFromSession(fn);
    });

    // removing session data
    bot.action(`clear`, async (fn: Context) => {
        await clearSession(fn);
    });

    // starting check process with asking the question about the product
    bot.action('do_check', async (fn: Context, next: NextFunction) => {
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
    await initChoices();

    // if user had some problems with the physical status of the product or not
    bot.action('upload', async (fn: any, next: NextFunction) => {
        fn.session.physicalQuality = `bad`;
        // next
        await optionalPhoto(fn);
        return next();
    });

    bot.action('good', async (fn: any, next: NextFunction) => {
        fn.session.physicalQuality = `good`;
        // next
        await optionalPhoto(fn);
        return next();
    });

    bot.action('uploadPhoto', async (fn: any) => {
        await optionalPrice(fn);
    });


    // after uploading photo ask for price
    bot.action(`continueWithPrice`, async (fn: any) => await askForLocation(fn));
    // if user had bad experience with the delivery location or not
    bot.action('yes', async (fn: any, next: NextFunction) => {
        fn.session.locationDelivery = `Yes`;
        await optionalLocation(fn);
        return next();
    });

    bot.action('no', async (fn: any, next: NextFunction) => {
        fn.session.locationDelivery = `No`;
        await optionalLocation(fn)
        return next();
    });

    //after location finish
    bot.action('uploadLocation', async (fn: Context) => {
        await indicateFinish(fn);
    });


    // if user want to cancel and quit
    bot.action(`cancel`, async (fn: any) => {
        await quitBot(fn);
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
    bot.on(`text`, async (fn: any) => {
        if (typeof fn.message.text === 'number') {
            console.log(`price`);
            fn.session.price = parseFloat(fn.message.text.trim());
        }
    });
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
async function quitBot(fn: Context) {
    // quitting the bot
    // Explicit usage
    await fn.replyWithHTML(`<b>bye bye 👋🏻</b>`);
}

/**
 * @function
 * @namespace checkPhysicalStatus
 * @param fn telegram context
 * @description asking user about the physical status of the product
 */

async function checkPhysicalStatus(fn: Context) {
    await fn.replyWithHTML(`<b>How was the physical status of the product?</b>`, Markup.inlineKeyboard([
            [Markup.button.callback(`Good`, `good`), Markup.button.callback(`Bad`, 'bad')],
            [Markup.button.callback('cancel', 'cancel')]
        ]
    ));
}

/**
 * @function
 * @namespace askForLocation
 *  * @param fn telegram context
 * @description asking user about the location
 */
async function askForLocation(fn: Context) {
    await fn.replyWithHTML(`<b>are you satisfied delivery location?</b>`, Markup.inlineKeyboard([
            [Markup.button.callback(`Yes`, `yes`), Markup.button.callback(`No`, `no`)],
            [Markup.button.callback('cancel', 'cancel')]
        ]
    ));
}

/**
 * @async
 * @function
 * @namespace getDataFromSession
 * @param fn fn telegram context
 * @description getting stored data from session and send it to user
 */
async function getDataFromSession(fn: any) {
    if (fn.session) {
        let price = fn.session.price == null ? `Empty` : fn.session.price;
        let location = fn.session.location == null ? `Empty` : fn.session.location;
        let physicalQuality = fn.session.physicalQuality == null ? `Empty` : fn.session.physicalQuality;
        let deliverySatisfaction = fn.session.locationDelivery == null ? `Empty` : fn.session.locationDelivery;
        let trackShipmentQuality = fn.session.ratedQuality == null ? `Empty` : fn.session.ratedQuality;
        //displaying result to user
        await fn.replyWithHTML(`<b>overall quality rate: ${trackShipmentQuality}</b>`)
        await fn.replyWithHTML(`<b>delivery satisfaction : ${deliverySatisfaction} </b>`);
        await fn.replyWithHTML(`<b>price of the product: ${price}</b>`);
        await fn.replyWithHTML(`<b>product physical quality ${physicalQuality}</b>`);

        if (location == `Empty`) {
            await fn.replyWithHTML(`<b>there is no location</b>`);

        } else {
            await fn.replyWithLocation(location.latitude, location.longitude);
        }
        await fn.replyWithHTML(`<b>Sent photos of the product</b>`);
        if (fn.session.productPhoto) {
            for await(let photo of fn.session.productPhoto) {
                await fn.replyWithPhoto(photo.file_id);
            }
        } else {
            await fn.replyWithHTML(`<b>No Photos were found sorry 😓</b>`)
        }

    } else {
        await fn.replyWithHTML(`<b>sorry there is nothing in the session please do new check and view it again</b>`);
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
    await fn.replyWithMarkdown(`Removing session from database and all data gonna be deleted`);
    fn.session = null;
}

/**
 * @async
 * @function
 * @namespace indicateFinish
 * @param fn telegram context
 * @description indicates that the process of checking is done
 */
async function indicateFinish(fn: Context) {
    await fn.replyWithHTML(`<b>Great We Finished thank you for your feedback you can view the last operation you did by typing view session</b>`);

}

/**
 * @async
 * @function
 * @namespace initChoices
 * @description preparing choices for quality question
 */
async function initChoices() {
    for await(let [_, value] of Object.entries(AnswersQuires.ratingQuality)) {
        bot.action(value.num, async (fn: any, next: NextFunction) => {
            fn.session.ratedQuality = value.num;
            await checkPhysicalStatus(fn);
            return next();
        });
    }
}

/**
 * @async
 * @function
 * @namespace optionalPhoto
 * @param fn telegram context
 * @description asks the user if he/she prefers to upload a photo of the product
 */
async function optionalPhoto(fn: Context) {
    await fn.replyWithHTML(`<b>Would like to provide a picture? if yes please send it and press okay if you would like to skip just press okay</b>`, Markup.inlineKeyboard([
        Markup.button.callback(`Okay`, 'uploadPhoto'),

    ]));
}

/**
 * @async
 * @function
 * @namespace optionalLocation
 * @param fn telegram context
 * @description asks the user if he/she prefers to upload a location of the delivery
 *
 */
async function optionalLocation(fn: Context) {
    await fn.replyWithHTML(`<b>can you provide the location? you can skip or send location and click Okay to proceed</b>`, Markup.inlineKeyboard([
        Markup.button.callback(`Okay`, 'uploadLocation'),
    ]));
}

/**
 * @async
 * @function
 * @namespace optionalPrice
 * @param fn telegram context
 * @description asks the user to enter the price of the product
 */
async function optionalPrice(fn: Context) {
    await fn.replyWithHTML(`<b>What is the price of the product ?</b> type the price and press Continue to proceed next`, Markup.inlineKeyboard([
        Markup.button.callback(`continue`, 'continueWithPrice')
    ]));
}

