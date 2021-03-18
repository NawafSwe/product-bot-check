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
        yield fn.replyWithHTML('<b>available commands</b>', Markup.inlineKeyboard([Markup.button.callback(`${botQuires_1.BotCommands.doHealthCheck.name}`, `do_check`),])
            .oneTime()
            .resize());
    }));
    // triggered after help
    // starting check process
    bot.action('do_check', (fn, next) => __awaiter(this, void 0, void 0, function* () {
        yield fn.replyWithHTML(`<b>Rate quality of tracking the shipment from 0 to 5</b>`, Markup.inlineKeyboard([
            [
                Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.zero.num, botQuires_1.AnswersQuires.ratingQuality.zero.num),
                Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.one.num, botQuires_1.AnswersQuires.ratingQuality.one.num),
                Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.two.num, botQuires_1.AnswersQuires.ratingQuality.two.num),
                Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.three.num, botQuires_1.AnswersQuires.ratingQuality.three.num),
                Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.four.num, botQuires_1.AnswersQuires.ratingQuality.four.num),
                Markup.button.callback(botQuires_1.AnswersQuires.ratingQuality.five.num, botQuires_1.AnswersQuires.ratingQuality.five.num)
            ],
            [Markup.button.callback('cancel', 'cancel')]
        ]));
    }));
    // action for user interaction after choosing rating
    // if he choose 0
    bot.action(botQuires_1.AnswersQuires.ratingQuality.zero.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.zero.num;
        checkPhysicalStatus(fn);
        return next();
    }));
    bot.action(botQuires_1.AnswersQuires.ratingQuality.one.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.one.num;
        yield checkPhysicalStatus(fn);
        return next();
    }));
    bot.action(botQuires_1.AnswersQuires.ratingQuality.two.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.two.num;
        checkPhysicalStatus(fn);
        return next();
    }));
    bot.action(botQuires_1.AnswersQuires.ratingQuality.three.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.three.num;
        checkPhysicalStatus(fn);
        return next();
    }));
    bot.action(botQuires_1.AnswersQuires.ratingQuality.four.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.four.num;
        checkPhysicalStatus(fn);
        return next();
    }));
    bot.action(botQuires_1.AnswersQuires.ratingQuality.five.num, (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.ratedQuality = botQuires_1.AnswersQuires.ratingQuality.five.num;
        checkPhysicalStatus(fn);
        return next();
    }));
    bot.action('bad', (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.physicalQuality = `bad`;
        // next
        askForLocation(fn);
        return next();
    }));
    bot.action('good', (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.physicalQuality = `good`;
        // next
        yield askForLocation(fn);
        return next();
    }));
    bot.action('yes', (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.locationDelivry = `Yes`;
        yield getPrice(fn, next);
        return next();
    }));
    bot.action('no', (fn, next) => __awaiter(this, void 0, void 0, function* () {
        fn.session.locationDelivry = `No`;
        yield getPrice(fn, next);
        return next();
    }));
    bot.action(`cancel`, (_) => {
        quitBot();
    });
    // on receiving location or photo
    bot.on([`photo`, `location`], (fn) => {
        if (fn.message.photo) {
            fn.session.productPhoto = fn.message.photo;
        }
        if (fn.message.location) {
            fn.session.location = fn.message.location;
        }
    });
    // commands
    bot.command('/stat', (fn) => {
        fn.replyWithHTML(`database has ${fn.session.ratedQuality}`);
    });
    // quit bot will be triggered when user type /quit
    quitBot();
    bot.launch();
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
exports.initialStart = initialStart;
// helper functions
function quitBot() {
    // quitting the bot
    bot.command(botQuires_1.BotCommands.quit, (fn) => {
        // Explicit usage
        fn.telegram.leaveChat(fn.message.chat.id);
        fn.replyWithHTML(`<b>bye bye 👋🏻</b>`);
        // Using context shortcut
        fn.leaveChat();
    });
}
function checkPhysicalStatus(fn) {
    fn.replyWithHTML(`<b>How was the physical status of the product? before answering You can send photo of the current product 📷 </b>`, Markup.inlineKeyboard([Markup.button.callback(`Good`, `good`), Markup.button.callback(`Bad`, 'bad')]));
    // proceeding  to location
}
function askForLocation(fn) {
    fn.replyWithHTML(`<b>are you satisfied delivery location? you can provide the location of the delivery before answering 🧭</b>`, Markup.inlineKeyboard([
        Markup.button.callback(`Yes`, `yes`), Markup.button.callback(`No`, `no`)
    ]));
}
function getPrice(fn, next) {
    return __awaiter(this, void 0, void 0, function* () {
        fn.answerCbQuery();
        let price = yield fn.ask({ text: `<b>what is the price of the product ?</b>`, parse_mode: 'HTML' });
        if (price != null) {
            fn.session.price = price;
        }
        return next();
    });
}
