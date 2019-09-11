const fs = require('fs');
const fetch = require('node-fetch');
const Util = require('./utils.js');

class Pixabay {
    constructor({ keyword, pageLimit, tag }) {
        this.tag = tag;
        this.keyword = keyword;
        this.pageLimit = pageLimit;
        this.currentPage = 1;
        this.sources = [];        
    }

    async collect() {
        console.log('---------- COLLECTING ----------');
        const target = `https://pixabay.com/images/search/${this.keyword}/?pagi=${this.currentPage}`;
        const body = await fetch(target).then(res => res.text());
        this.sources = body.match(/srcset=\"[^"]+\"/g).map(item => item.slice(8, item.indexOf(' 1x,')).replace('__340', '_960_720'));
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

new Pixabay({
    tag: 'pixabay_china',
    keyword: 'beijing',
    pageLimit: 1,
}).run();