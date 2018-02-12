/**
 * This plugin creates a snapshot from video stream (using ffpmeg) and sends it
 * as a photo.
 * Set stream URL and temporary file path below.
 * FFMPEG is obviously required :)
*/
const exec = require('child_process').exec;
const fs = require('fs');

const streamURL = "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/v8/fileSequence0.ts"
const tmpFilePath = "/tmp/stream_snapshot.jpg"

module.exports = function processMsg(msg, config) {
    return new Promise((resolve, reject) => {
        //adjust ffmpeg parameters as needed
        exec(`ffmpeg -y -i ${streamURL} -vframes 1 -r 1 ${tmpFilePath}`,
            (e, stdout, stderr) => {
                if (e) {
                    console.log(e);
                    resolve(`Sorry ${msg.from.first_name || msg.from.username}, seems like the Stream isn't available right now. Please try later.`);
                } else {
                    resolve(fs.createReadStream(tmpFilePath))
                }
            })
    })
}