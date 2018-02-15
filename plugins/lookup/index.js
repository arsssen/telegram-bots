/**
 * This plugin will look for a string in CSV file's(data.csv inside plugins dir)
 * first column and will return all matching strings
 * it parses file on every request, so it'll be slow on large files.
 * Needs to be rewritten if performance is important.
*/
const path = require('path')
const fs = require('fs')
module.exports = function processMsg(msg, config) {
    return new Promise((resolve, reject) => {
        let term = msg.text.toLowerCase();
        let currentPath = __filename.split(path.sep).slice(0, -1).join(path.sep);
        let fileName = [currentPath, 'data.csv'].join(path.sep)
        let reSeparators = /[\s\(\)\-\_]/g;
        let reCRs = /\r/g;
        fs.readFile(fileName, function (err, f) {
            var lines = f.toString().split('\n');
            let result = lines.reduce((acc, line) => {

                [k, ...v] = line.split(',')
                key = k.toLowerCase().replace(reSeparators, "")
                v = v.join(" ").replace(reCRs, "");
                if (key.indexOf(term.replace(reSeparators, "")) !== -1) {
                    acc.push(`${k}: ${v}`)
                }
                return acc;
            }, [])
            if (result.length) {
                resolve(`Results for ${term}: \n${result.join("\n")}`)
            } else {
                resolve(`No results for ${term}`)
            }
        });
    })
}