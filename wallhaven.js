const fs = require('fs');
// const fetch = require('node-fetch');
const Util = require('./utils.js');
const puppeteer = require('puppeteer-core');

class Wallhaven {
    constructor({ keyword, pageLimit, tag }) {
        this.tag = tag;
        this.keyword = keyword;
        this.pageLimit = pageLimit;
        this.currentPage = 1;
        this.sources = [];        
    }

    async collect() {
        console.log('---------- COLLECTING ----------');
        const browser = await puppeteer.launch({
            // chrome://version
            executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // windows
            // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
        });
        const page = await browser.newPage();
        await page.goto('https://wallhaven.cc', { timeout: 3000 }).then(() => {}, () => {});
        const url = `https://wallhaven.cc/search?q=${this.keyword}&page=${this.currentPage}`;
        const result = await page.evaluate(async (url) => {
            const body = await window.fetch(url, {
                credentials: 'include',
                headers: {
                    'accept': 'text/html, */*; q=0.01',
                    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'x-requested-with': 'XMLHttpRequest'
                },
                referrer: 'https://wallhaven.cc/search',
                referrerPolicy: 'no-referrer-when-downgrade',
                body: null,
                method: 'GET',
                mode: 'cors'
            }).then(res => res.text());
            return body;
        }, url);
        this.sources = result.match(/https:\/\/wallhaven\.cc\/w\/[^"]+/g).map(link => {
            const id = link.slice(-6);
            return `https://w.wallhaven.cc/full/${id.slice(0, 2)}/wallhaven-${id}.jpg`;
        });
        await browser.close();
        console.log(`Collected ${this.sources.length} Files`);
    }

    async download() {
        console.log('---------- DOWNLOADING ----------');
        for (let i = 0; i < this.sources.length; i++) {
            const source = this.sources[i];
            const local = `./results/${this.tag}/${source.slice(source.lastIndexOf('/') + 1)}`;
            if (!fs.existsSync(local)) {
                await Util.downloadFile(source, local);
                console.log(`${i + 1}/${this.sources.length}`, source);
            }
        }
    }

    async run() {
        try {
            await this.collect();
            await this.download();
            console.log('Finished');
        } catch (e) {
            console.log(e);
        }
    }
}

new Wallhaven({
    tag: 'wallhaven_china',
    keyword: 'china',
    pageLimit: 1,
}).run();
