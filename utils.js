const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const fetch = require('node-fetch');
const AbortController = require('abort-controller');

const downloadFile = (url, filepath, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const controller = new AbortController();
        const timer = setTimeout(() => {
            controller.abort();
        }, timeout);

        fetch(url, { signal: controller.signal })
        .then(res => {
            const writePath = path.parse(filepath);
            mkdirp.sync(writePath.dir);
            const dest = fs.createWriteStream(filepath);
            res.body.pipe(dest);
            dest.on('error', (e) => reject(e));
            dest.on('finish', () => resolve({ url, filepath }));
        })
        .catch((e) => reject(e))
        .finally(() => clearTimeout(timer));
    });
};

module.exports = {
    downloadFile,
};
