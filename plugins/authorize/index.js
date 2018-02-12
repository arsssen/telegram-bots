/**
  * This plugin checks if the sender is in "admins" list (set in config file)
  * If yes, it just passes execution to next plugin, if not execution stops.
  * This plugin MUST be set before other plugins in config if you need to protect them.
  * It can send a response in case of unauthorized user, or be silent, behaviour
  * is set in config file (authorize_plugin.silent)
*/
module.exports = function processMsg(msg, config) {
    return new Promise((resolve, reject) => {
        let admins = Array.isArray(config.admins) ? config.admins : [];
        if (admins.indexOf(msg.from.username) !== -1) {
            resolve(undefined);
        } else {
            let beSilent = config.authorize_plugin && config.authorize_plugin.silent;
            reject(beSilent ? undefined : "not authorized");
        }

    })
}