const Slimbot = require('slimbot');
const fs = require('fs');
const process = require('process');

let configFilePath = process.argv.length > 2 ? process.argv[2] : "config.json";

const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));

if (!config.token || config.token.length < 1) {
    console.log("token not present, cannot continue");
    process.exit(1);
}
const slimbot = new Slimbot(config.token);

const activePlugins = Array.isArray(config.plugins) ? config.plugins : [];
const plugins = activePlugins.map(name => require(`./plugins/${name}/`))

// pass the message to plugins in chain and stop if any of them returns rejected value
const processMessage = message => plugins.reduce((acc, pluginFunc) => {
    return acc
        .then(
            prevResponses => pluginFunc(message, config)
                .then(currResponse => [...prevResponses, currResponse])
                .catch(currResponse => Promise.reject([...prevResponses, currResponse]))
        )
        .catch(prevResponses => Promise.reject(prevResponses))
}, Promise.resolve([]))

const log = config.no_log ? () => () => { } : (msg, response) => () => {
    let ts = new Date().toLocaleString();
    console.log(`${ts} bot <- ${msg.from.first_name}(${msg.from.username}) : ${msg.text}`)
    console.log(`${ts} bot -> ${msg.from.first_name}(${msg.from.username}) : ${response}`)
}

slimbot.on('message', msg => processMessage(msg).then(x => x, x => x).then(
    responses => responses.forEach(response => {
        switch (typeof response) {
            case 'object':
                slimbot
                    .sendPhoto(msg.chat.id, response)
                    .then(log(msg, 'file'), log(msg, 'file'));
                break;
            case 'string':
                slimbot
                    .sendMessage(msg.chat.id, response)
                    .then(log(msg, response), log(msg, response));
                break;
            case 'undefined':
                log(msg, 'no response')()
                break;
        }
    })
))
slimbot.startPolling();
