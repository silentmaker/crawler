const fs = require('fs');
const videos = require('./videos.json');
const items = require('./items.json');
const decodeNumber = require('./decodeNumber');

const data = [];

items.map((item, index) => {
    if (videos[item.photoId]) {
        const newData = Object.assign({}, item, {
            videoName: `video_${index + 1}`,
            videoUrl: videos[item.photoId],
            likeCount: decodeNumber(item.likeCount),
            viewCount: decodeNumber(item.viewCount),
            commentCount: decodeNumber(item.commentCount),
            timestamp: new Date(item.timestamp).toISOString().slice(0, 16).replace('T', ' '),
        })
        data.push(newData);
    }
});

console.log('Final Targets: ', data.length);

fs.writeFile("./data.json", JSON.stringify(data), function() {});
