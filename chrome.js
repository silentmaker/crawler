var itemList = temp1.slice(0, 100);

var iframe = document.createElement('iframe');
iframe.id = 'ks-iframe';iframe.src = 'https://baidu.com';
iframe.width = 400;iframe.height = 300;
$('.profile-header').appendChild(iframe);

var index = 0;
var source = {};
var getVideo = function(i) {
    window.frames['ks-iframe'].src = itemList[i].targetUrl;
    setTimeout(function() {
        source[itemList[i].photoId] = window.frames['ks-iframe'].contentDocument.querySelector('.player-video').src;
        index += 1;
        if (index < itemList.length) getVideo(index);
        else console.log('finished');
    }, 4000);
}

// getVideo(index);
// copy(source);
// index = 0;itemList = temp1.slice(100, 200)
 