const phantom = require('phantom');

function delay(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(async function() {
            resolve();
        }, time)
    });
}

async function requestPage(url) {
    const instance = await phantom.create();
    const page = await instance.createPage();
    console.info('Requesting', url);
    // await page.on('onResourceRequested', function(requestData) {
    //     console.info('Requesting', requestData);
    // });

    const status = await page.open(url);
    let video = '';    
    if (status === 'success') {
        console.log(await page.setting('userAgent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'));
        page.property('viewportSize', { width: 1024, height: 768 });
        page.property('clipRect', { top: 0, left: 0, width: 1024, height: 768 });
        console.log(await page.property('content'));
        while(!video) {
            video = await page.evaluate(function() {
                return document.querySelector('.player-video');
            });
            console.log('Video URL:', video);
            await page.render(`github${Date.now()}.png`);
            if (!video) await delay(2000);
        }
    }

    await instance.exit();
}
requestPage('https://live.kuaishou.com/u/3xf48g2sws8tu6u/3xk4fp2w6sgiqh2?did=web_0abe6a48af297834f0ad36852a11d1d6');
module.exports = requestPage;
