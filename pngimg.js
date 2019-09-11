const fs = require('fs');
// const fetch = require('node-fetch');
const Util = require('./utils.js');
const puppeteer = require('puppeteer-core');

class Pngimg {
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
        const url = `http://pngimg.com/search/?search=${this.keyword}&page=${this.currentPage}`;

        await page.goto(url, { timeout: 3000 }).then(() => {}, () => {});
        this.sources = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.png_png img')).map(item => item.src);
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

new Pngimg({
    tag: 'pngimg_animals',
    keyword: 'panda',
    pageLimit: 1,
}).run();
