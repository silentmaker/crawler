const fs = require('fs');
const XLSX = require('xlsx');
const data = require('./data.json');
const items = require('./itemSource.json');
const videos = require('./videos.json');
const decodeNumber = require('./decodeNumber');

let newItems = items.map(item => {
    const newItem = {
        caption: item.caption,
        timestamp: item.timestamp,
        poster: item.poster,
        uid: item.user.id,
        photoId: item.photoId,
        likeCount: decodeNumber(item.likeCount),
        viewCount: decodeNumber(item.viewCount),
        commentCount: decodeNumber(item.commentCount),
        targetUrl: `https://live.kuaishou.com/u/${item.user.id}/${item.photoId}`,
        timestamp: new Date(item.timestamp).toISOString().slice(0, 16).replace('T', ' '),
    };
    if (videos[newItem.photoId]) newItem.videoUrl = videos[item.photoId];
    return newItem;
});

newItems = newItems.filter(item => item.caption.indexOf('...') !== -1 && item.viewCount > 5000);

newItems.sort((a, b) => (b.viewCount - a.viewCount));

// const dotCaptions = items.filter(item => item.caption.indexOf('...') !== -1);
// const phoneCaptions = items.filter(item => item.caption.indexOf('手机') !== -1);
// const oneCaptions = items.filter(item => item.caption.indexOf('1元') !== -1);
// const nineCaptions = items.filter(item => item.caption.indexOf('9块9') !== -1);
// const fruitCaptions = items.filter(item => item.caption.indexOf('水果') !== -1);
// console.log('总数', items.length);
// console.log('标题含...：', dotCaptions.length);
// console.log('标题含手机：', phoneCaptions.length);
// console.log('标题含1元：', oneCaptions.length);
// console.log('标题含9块9：', nineCaptions.length);
// console.log('标题含水果：', fruitCaptions.length);

// console.log('标题含...且播放量>5000的视频：', newItems.slice(0, 10));
console.log('标题含...且播放量>5000的视频数量：', `${newItems.length}`);

let index = 400;
newItems.forEach(item => {
    const oldData = data.filter(i => item.photoId === i.photoId);
    if (oldData.length) {
        item.videoName = oldData[0].videoName;
    } else {
        item.videoName = `video_${index + 1}`;
        index += 1;
    }
});

// 小安要的
const needed = ['video_126', 'video_127', 'video_130', 'video_131', 'video_132', 'video_136', 'video_139', 'video_142', 'video_159', 'video_160', 'video_169', 'video_218',
'video_222', 'video_226', 'video_264', 'video_265', 'video_266', 'video_267', 'video_270', 'video_283', 'video_303', 'video_305', 'video_309', 'video_310', 'video_311',
'video_314', 'video_316', 'video_317', 'video_331', 'video_332', 'video_336', 'video_36', 'video_361', 'video_367', 'video_369', 'video_374', 'video_381', 'video_385',
'video_387', 'video_389', 'video_390', 'video_391', 'video_394', 'video_395', 'video_401', 'video_405', 'video_406', 'video_407', 'video_408', 'video_417', 'video_422',
'video_427', 'video_428', 'video_431', 'video_433', 'video_436', 'video_438', 'video_439', 'video_449', 'video_454', 'video_455', 'video_458', 'video_459', 'video_46',
'video_460', 'video_466', 'video_467', 'video_470', 'video_471', 'video_473', 'video_477', 'video_478', 'video_480', 'video_481', 'video_482', 'video_492', 'video_493',
'video_500', 'video_511', 'video_514', 'video_520', 'video_521', 'video_65', 'video_66', 'video_67', 'video_68', 'video_70'];
const neededItems = newItems.filter(item => {
    return parseInt(item.videoName.slice(6), 10) > 400 && needed.indexOf(item.videoName) !== -1;
});
console.log('暂无videoUrl的视频数量：', neededItems.filter(item => !item.videoUrl).length);
fs.writeFile("./dataNeeded.json", JSON.stringify(neededItems), function() {});

const header = [{
    videoName: '编号',
    caption: '标题',
    timestamp: '日期',
    viewCount: '播放量',
    likeCount: '点赞量',
    commentCount: '评论数',
    targetUrl: '视频播放页面',
    // videoUrl: '视频文件地址',
    poster: '封面图片',
    uid: '用户ID',
    photoId: '视频ID',
}];

const sheet = XLSX.utils.json_to_sheet(header.concat(newItems), {
    header: ['videoName', 'caption', 'timestamp', 'viewCount', 'likeCount', 'commentCount', 'targetUrl', 'poster', 'uid', 'photoId'],
    skipHeader:true,
});

const book = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(book, sheet, 'Sheet1');

XLSX.writeFile(book, `./result/kuaishou_${Date.now()}.xlsx`);
