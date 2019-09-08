const XLSX = require('xlsx');
const data = require('./data.json');

const header = [{
    videoName: '编号',
    caption: '标题',
    timestamp: '日期',
    viewCount: '播放量',
    likeCount: '点赞量',
    commentCount: '评论数',
    targetUrl: '视频播放页面',
    videoUrl: '视频文件地址',
    poster: '封面图片',
    uid: '用户ID',
    photoId: '视频ID',
}];

const sheet = XLSX.utils.json_to_sheet(header.concat(data), {
    header: ['videoName', 'caption', 'timestamp', 'viewCount', 'likeCount', 'commentCount', 'targetUrl', 'videoUrl', 'poster', 'uid', 'photoId'],
    skipHeader:true,
});

const book = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(book, sheet, 'Sheet1');

XLSX.writeFile(book, `./result/kuaishou_${Date.now()}.xlsx`);
