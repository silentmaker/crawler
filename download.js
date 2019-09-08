const fetch = require('node-fetch');
const fs = require('fs');

const targets = require('./dataNeeded.json');

function downloadFile(url, name) {
    return new Promise((resolve, reject) => {
        fetch(url).then(res => {
            const dest = fs.createWriteStream(`./videos/${name}.mp4`);
            res.body.pipe(dest);
            dest.on('finish', resolve);
        });
    });
}

async function downloadAll() {
    for (let i = 0; i < targets.length; i++) {
        console.log('Downloading', targets[i].videoName);
        await downloadFile(targets[i].videoUrl, targets[i].videoName);
    }
}

downloadAll();