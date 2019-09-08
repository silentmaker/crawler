const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const fetch = require("node-fetch");
const puppeteer = require('puppeteer-core');
const AbortController = require('abort-controller');

const doDownload = (url, filepath, timeout = 5000) => {
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
            dest.on('error', reject);
            dest.on('finish', resolve);
        })
        .catch(reject)
        .finally(() => {
            clearTimeout(timer);
        });
    });
};

const doFetch = (params) => {
    return new Promise((resolve, reject) => {
        fetch("https://live.kuaishou.com/graphql", {
            credentials: "include",
            headers: {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                "content-type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
                "Origin": "https://live.kuaishou.com",
            },
            referrer: "https://live.kuaishou.com/profile/3xf48g2sws8tu6u",
            origin: "https://live.kuaishou.com",
            referrerPolicy: "unsafe-url",
            body: JSON.stringify(params),
            method: "POST",
            mode: "cors"
        })
        .then(res => {
            return res.json();
        })
        .then((data) => {
            resolve(data);
        })
        .catch(error => reject(error));
    });
};

const doBrowse = async (config) => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    });
    const page = await browser.newPage();

    let targetItems;
    let fileCount = 0;
    let { entry } = config;

    while(entry) {
        await page.goto(entry);
        console.log('current', entry);

        targetItems = await page.evaluate((config) => {
            return Array.from(document.querySelectorAll(config.selector)).map(item => {
                const { src, dataset } = item;
                const target  = { src, dataset: {} };
                for (const key in item.dataset) {
                    target.dataset[key] = item.dataset[key];
                }
                return target;
            });
        }, config);
    
        for (let i = 0; i < targetItems.length; i++) {
            const item = targetItems[i];
            const source = config.process(item);
            const local = `./${config.folder}/${source.slice(source.lastIndexOf('/') + 1)}`;
            if (!fs.existsSync(local)) {
                console.log('downloading', source);
                try {
                    await doDownload(source, local);
                    fileCount += 1;
                } catch(e) {
                    console.log('last task aborted or failed');
                }
            }
        }

        entry = config.next(entry);
    }

    await browser.close();
    console.log(`processed files - ${fileCount}/${targetItems.length}`);
};

const configs = {
    PIXABAY_THEME: {
        folder: 'pixabay_china',
        selector: '.flex_grid .item img',
        entry: 'https://pixabay.com/images/search/chengdu/?pagi=1',
        process: (item) => {
            const target = item.dataset.lazy || item.src;
            return target.replace('__340', '_960_720');
        },
        next: (entry) => {
            const index = entry.indexOf('pagi=') + 5;
            const nextPage = parseInt(entry.slice(index), 10) + 1;
            return nextPage > 1 ? '' : `${entry.slice(0, index)}${nextPage}`;
        },
    },
};


doBrowse(configs.PIXABAY_THEME);