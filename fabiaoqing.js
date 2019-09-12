// data-original="http://ww2.sinaimg.cn/bmiddle/9150e4e5gy1g6qlfb10avj20d70f7gmf.jpg"

const fs = require('fs');
const fetch = require('node-fetch');
const Util = require('./utils.js');

class Fabiaoqing {
    constructor({ pageLimit, tag }) {
        this.tag = tag;
        this.pageLimit = pageLimit;
        this.currentPage = 1;
        this.sources = [];        
    }

    async collect() {
        console.log('---------- COLLECTING ----------');
        const target = `https://fabiaoqing.com/biaoqing/lists/page/${this.currentPage}.html`;
        const body = await fetch(target).then(res => res.text());
        this.sources = body.match(/data-original=\"[^"]+\"/g).map(item => item.slice(15, -1));
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
        while (this.currentPage <= this.pageLimit) {
            try {
                console.log('Current Page', this.currentPage);
                await this.collect();
                await this.download();
                this.currentPage += 1;
            } catch (e) {
                console.log(e);
            }
        }
        console.log('Finished');
    }
}

new Fabiaoqing({
    tag: 'fabiaoqing_hot',
    pageLimit: 5,
}).run();
