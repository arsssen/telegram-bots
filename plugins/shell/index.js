/**
  * This plugin executes received command in shell and returns the output.
*/
const exec = require('child_process').exec;

module.exports = function processMsg(msg, config) {
    return new Promise((resolve, reject) => {
        exec(msg.text, (e, stdout, stderr) => {
            let resp;
            if (e instanceof Error) {
                resp = `${msg.text} : ${e}`;
                console.log(e);
            } else {
                resp = `${stdout} ${stderr}`;
            }
            resolve(resp)
        })
    })
}