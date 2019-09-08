const puppeteer = require('puppeteer-core');
const fetchData = require('./fetchData');

console.log(fetchData);
fetchData('publicFeedsQuery').then(data => {
    console.log(data.data.publicFeeds.list.length);
});

const run = async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    });
    const page = await browser.newPage();
    let videoUrl;
    // await page.screenshot({ path: './screenshot.png' });

    await page.goto('https://live.kuaishou.com/u/3xf48g2sws8tu6u/3xk4fp2w6sgiqh2');

    videoUrl = await page.evaluate(() => {
        return document.querySelector('.player-video').src;
    });

    console.log('videoUrl:', videoUrl);

    await browser.close();
};

run();