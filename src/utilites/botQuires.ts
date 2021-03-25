/**
 * @module src/utilities/botQuires.ts
 * this module holds bot quires variables
 */


/**
 * @namespace AnswersQuires
 * @description contains all answer quires to user it as actions in the app
 */
export const AnswersQuires = {
    ratingQuality: {
        zero: {num: '0', id: '0s'},
        one: {num: '1', id: '1s'},
        two: {num: '2', id: '2s'},
        three: {num: '3', id: '3s'},
        four: {num: '4', id: '4s'},
        five: {num: '5', id: '5s'},

    }
}
/**
 * @namespace BotCommands
 * @description contains all required bot commands associated with the bot.
 */
export const BotCommands = {
    rateShipment: {name: 'How was the quality of tracking the shipment'},
    ratePhysical: {name: 'rate Physical'},
    doHealthCheck: {name: "want to do new check?"},
    deliveryLocation: {name: 'please provide the delivery location'},
    physicalStatus: {name: 'How was the physical status'},
    quit: {name: 'quit'},
    help: {name: 'help'},
    viewSession: {name: 'data'},
    clearSession: {name: 'clearData'},
    commands: {name: 'commands'}
}
/**
 *@namespace BotQuires
 * @description bot queries contains all required sentences for the bot , using this approach to avoid typos and to much typing
 * while developing the logic in the controller.
 */
export const BotQuires = {
    welcomingUser: {
        query: `<b>Hello</b> <i>welcome to product bot checker</i>. 📥`
    },
    instructions: `to know how to use the bot please send type <b>/help</b> 😆`,
    availableCommands: `<b>Available commands 💻 :</b> \n 
        <b>/help</b> \n 
        <b>/${BotCommands.viewSession.name}</b> \n 
        <b>/${BotCommands.clearSession.name}</b> \n 
        <b>/${BotCommands.quit.name}</b> \n
`
}

/**
 * @function
 * @namespace mappingBotCommands
 * @description function that maps the name of the commands for a bot maybe used for future development
 */
export function mappingBotCommands() {
    let commandList = [];
    let keys = Object.values(BotCommands);
    for (let value of Object.values(keys)) {
        commandList.push(value.name);
    }
    return commandList;
}
