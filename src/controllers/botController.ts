const {Telegraf, Markup, Extra} = require('telegraf')


const bot = new Telegraf(process.env.BOT_API);

export function initialStart() {
    bot.start((fn: any) => fn.reply('Welcome to health care bot how can I help you?'));
    bot.hears('hello', (fn: any) => {
        fn.replyWithHTML('<b>Hello</b>. <i>How are you today?</i>',
            Markup.keyboard([
                Markup.button.text('Not bad'),
                Markup.button.text('All Right')

            ])
        )
        bot.action('not bad', (fn: any) => {
            fn.editMessageText('<i>Have a nice day 😊</i>',
            )
        });

        bot.action('all right', (fn: any) => {
            fn.editMessageText('<i>May happiness be with you 🙏</i>',)
        })
    });

    bot.launch();

// Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

export function quitBot() {
    bot.command('quit', (fn: any) => {
        // Explicit usage
        fn.telegram.leaveChat(fn.message.chat.id);

        // Using context shortcut
        fn.leaveChat();
    })
}

