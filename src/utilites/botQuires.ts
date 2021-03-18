export const BotQuires = {
    welcomingUser: {
        query: `<b>Hello</b> <i>welcome to product bot checker</i>. 📥`
    },
    instructions: `to know how to use the bot please send type <b>/help</b> 😆`,
    askUserHealth: {
        query: "How are you doing? 🧐",
        firstChoice: "I am good thank you",
        secondChoice: "Not good at all",
        firstQuires: ['good', 'fine', 'all good', 'all fine', 'all good', "I am good thank you"],
        secondQuires: ['not good at all', 'not good', 'i am not', 'bad', 'sad', 'not okay']
    },
}
export const AnswersQuires = {
    ratingQuality: {
        zero: {num: '0', id: '0s'}
    }
}
export const BotCommands = {
    rateShipment: {
        name: 'rate Shipment'
    },
    ratePhysical: {
        name: 'rate Physical'
    },
    doHealthCheck: {
        name: "want to do new check?"
    },
    quit: {name: '/quit'},
    help: {name: '/help'},

}


export function mappingBotCommands() {
    let commandList = [];
    let keys = Object.values(BotCommands);
    for (let value of Object.values(keys)) {
        commandList.push(value.name);
    }
    return commandList;
}
