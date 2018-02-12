
# telegram-bots

telegram-bots is a simple [Telegram](https://telegram.org/) bot framework where plugins are used to receive messages and respond to them.

# Configuration

Configuration is read from the JSON file specified as first command line argument(or config.json file in current working directory if not).
The following fields in configuration are required:

- token: your telegram bot token (see [Telegram bot docs](https://core.telegram.org/bots))
- plugins: an array with list of plugins(name of plugin directory). The order is important, as message is processed by plugins in the provided order.

Configuration object is passed to all enabled plugins, so plugins can store their configuration in this file as well.

# Plugins

Each plugins is a JS module(named index.js) residing in its directory inside *plugins*.
To enable a plugin, just add its directory name to config file.
Plugins are executed in chain. Eeach message received by bot is passed to the plugin, then after processing the message plugin decides if it wants to respond to message and if message needs to be passed to the next plugin or processing must stop.

## Responding to messages

Each plugin exports a single function, which receives the message and the bot configuration object.
Plugin must return a promise, which is resolved or rejected with reponse value.
If response value is *undefined*, no response will be sent.
If promise is resolved, message will be passed to the next plugin in the chain for processing.
If promise is rejected, message will not be passed to next plugin(s).

## Included plugins

### authorize
Checks if the user sending message to bot is in the list of "admins" (set in config file).  If yes, passes execution to next plugin in chain, if no, stops processing the message (and optionally sends "ot authorized" message to the user). Put this plugin before any other plugins in chain to protect them from receiving messages from unathorized users. Can be also put in the middle of plugins chain, in that case will protect only plugins coming after it.

### shell
Tries to execute received message as a shell command and sends output back to the user. Be careful when using it ;)

### stream_snapshot
When receiving any message from the user captures a frame from predefined video stream and sends it to the user as a photo.
FFMPEG is required for the plugin to work.