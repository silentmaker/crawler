const fetch = require("node-fetch");

const userInfoQuery = {
  operationName: "userInfoQuery",
  variables: {},
  query: `query userInfoQuery {
        ownerInfo {
            id
            principalId
            kwaiId
            eid
            userId
            profile
            name
            description
            sex
            constellation
            cityName
            following
            living
            watchingCount
            isNew
            privacy
            feeds {
                eid
                photoId
                thumbnailUrl
                timestamp
                __typename
            }
            verifiedStatus {
                verified
                description
                type
                new
                __typename
            }
            countsInfo {
                fan
                follow
                photo
                liked
                open
                playback
                private
                __typename
            }
            bannedStatus {
                banned
                defriend
                isolate
                socialBanned
                __typename
            }
            __typename
        }
    }`
};

const publicFeedsQuery = {
    operationName: "publicFeedsQuery",
    variables: {
        principalId: '3xf48g2sws8tu6u',
        pcursor: "1.562307324195E12",
        count: 24,
    },
    query: `query publicFeedsQuery($principalId: String, $pcursor: String, $count: Int) {
        publicFeeds(principalId: $principalId, pcursor: $pcursor, count: $count) {
            pcursor
            live {
                user {
                    id
                    kwaiId
                    eid
                    profile
                    name
                    living
                    __typename
                }
                watchingCount
                src
                title
                gameId
                gameName
                categoryId
                liveStreamId
                playUrls {
                    quality
                    url
                    __typename
                }
                followed
                type
                living
                redPack
                liveGuess
                anchorPointed
                latestViewed
                expTag
                __typename
            }
            list {
                photoId
                caption
                thumbnailUrl
                poster
                viewCount
                likeCount
                commentCount
                timestamp
                workType
                type
                useVideoPlayer
                imgUrls
                imgSizes
                magicFace
                musicName
                location
                liked
                onlyFollowerCanComment
                relativeHeight
                width
                height
                user {
                    id
                    eid
                    name
                    profile
                    __typename
                }
                expTag
                __typename
            }
            __typename
        }
    }`
};

const allType = {
    userInfoQuery,
    publicFeedsQuery,
};

function fetchData(type) {
    const params = allType[type];
    if (params) {
        return new Promise((resolve, reject) => {
            // if (params.variables && params.variables.pcursor) {
            //     const present = `${Date.now()}`;
            //     params.variables.pcursor = `${present.slice(0, 1)}.${present.slice(1)}E12`;
            // }

            fetch("https://live.kuaishou.com/graphql", {
                credentials: "include",
                headers: {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "content-type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
                    "Origin": "https://live.kuaishou.com",
                },
                referrer: "https://live.kuaishou.com/profile/3xf48g2sws8tu6u",
                origin: "https://live.kuaishou.com",
                referrerPolicy: "unsafe-url",
                body: JSON.stringify(params),
                method: "POST",
                mode: "cors"
            })
            .then(res => {
                return res.json();
            })
            .then((data) => {
                resolve(data);
            })
            .catch(error => reject(error));
        });
    }
}

// fetchData('userInfoQuery').then(data => {
//     console.log(data.data.ownerInfo.countsInfo);
// });

// // 似乎对Origin做了同源限制，在chrome console可拉到数据
// fetchData('publicFeedsQuery').then(data => {
//     console.log(data.data.publicFeeds.list);
// });

module.exports = fetchData;