const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'items');

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    let list = [];
    files.forEach(function (file) {
        const target = require(`./items/${file}`);
        
        if (target.data && target.data.publicFeeds) {
            list = list.concat(target.data.publicFeeds.list);
        }
    });
    list = list.filter(item => item.timestamp > 1549270318121)
        .map(item => ({
            caption: item.caption,
            timestamp: item.timestamp,
            poster: item.poster,
            uid: item.user.id,
            photoId: item.photoId,
            likeCount: item.likeCount,
            viewCount: item.viewCount,
            commentCount: item.commentCount,
            targetUrl: `https://live.kuaishou.com/u/${item.user.id}/${item.photoId}`,
        }));
    console.log('Target Count', list.length);
    fs.writeFile("./items.json", JSON.stringify(list), function() {});
});
