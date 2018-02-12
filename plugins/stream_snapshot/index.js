/**
 * This plugin creates a snapshot from video stream (using ffpmeg) and sends it
 * as a photo.
 * Set stream URL and temporary file path in config
 * FFMPEG is obviously required :)
*/
const exec = require('child_process').exec;
const fs = require('fs');

module.exports = function processMsg(msg, config) {
    return new Promise((resolve, reject) => {
        let tmpFilePath = config.stream_snapshot_plugin.tmp_file_path || "/tmp/stream_snapshot.jpg"
        exec(`ffmpeg -i ${config.stream_snapshot_plugin.stream_url} ${config.stream_snapshot_plugin.ffmpeg_params} ${tmpFilePath}`,
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