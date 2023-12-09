let cookieString = document.cookie;
let videoId = String(cookieString.split("=")[1]);
console.log(videoId);
const apiKey1 = localStorage.getItem("api_Key");
const BASE_URL = "https://www.googleapis.com/youtube/v3";

window.addEventListener("load", onLoadScript);

function onLoadScript() {
  if (YT) {
    this.player = new window["YT"].Player("player", {
      videoId: videoId,
      width: "70%",
      playerVars: {
        autoplay: 0,
        controls: 1,
        autohide: 1,
        wmode: "opaque",
        origin: "http://127.0.0.1:5501/video.html",
      },
      onReady: (event) => {
        document.title = event.target.videoTitle;
      },
    });
  }
  extractVideoDetails(videoId);
  fetchStats(videoId);
}

//   extractVideoDetails(videoId);
// fetchStats(videoId)

const statsContainer = document.getElementsByClassName("video-details")[0];

async function extractVideoDetails(videoId) {
  try {
    let response = await fetch(
      `${BASE_URL}/commentThreads?key=${apiKey1}&videoId=${videoId}&maxResults=25&part=snippet`
    );
    let result = await response.json();
    console.log(result, "comments");
    renderComments(result.items);
  } catch (error) {
    console.log(`Error occured`, error);
  }
}

async function fetchStats(videoId) {
  console.log("Inside fetchStats");
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics&key=${apiKey1}&id=${videoId}`
    );
    const result = await response.json();
    const item = result.items[0];
    const title = document.getElementById("title");
    getRecommendedVideos(item.snippet.title);
    title.innerText = item.snippet.title;
    title.style.color = "white";
    title.style.fontSize = "20px";
    statsContainer.innerHTML = `
        <div class="profile">
                <img src="https://i.ytimg.com/vi/D-qj0L68RhQ/default.jpg" class="channel-logo" alt="">
                <div class="owner-details">
                    <span style="color: white ">${item.snippet.channelTitle}</span>
                    <span>20 subscribers</span>
                </div>
        </div>
        <div class="stats">
            <div class="like-container">
                <div class="like">
                    <span class="material-icons">thumb_up</span>
                    <span>${item.statistics.likeCount}</span>
                </div>
                <div class="like">
                    <span class="material-icons">thumb_down</span>
                </div>
            </div>
            <div class="comments-container">
                <span class="material-icons">comment</span>
                <span>${item.statistics.commentCount}</span>
            </div>
        </div>
        `;
  } catch (error) {
    console.log("error", error);
  }
}
const commentsContainer = document.getElementById("comments-container");

function renderComments(commentsList) {
  // comments Container
  for (let i = 0; i < commentsList.length; i++) {
    let comment = commentsList[i];
    const topLevelComment = comment.snippet.topLevelComment;
    //    console.log(comment.snippet.totalReplyCount);

    let commentElement = document.createElement("div");
    commentElement.className = "comment";
    commentElement.innerHTML = `
                <img src="${topLevelComment.snippet.authorProfileImageUrl}" alt="">
                <div class="comment-right-half">
                    <b>${topLevelComment.snippet.authorDisplayName}</b>
                    <p>${topLevelComment.snippet.textOriginal}</p>
                    <div style="display: flex; gap: 20px">
                        <div class="like">
                            <span class="material-icons">thumb_up</span>
                            <span>${topLevelComment.snippet.likeCount}</span>
                        </div>
                        <div class="like">
                            <span class="material-icons">thumb_down</span>
                        </div>
                        <button class="reply" onclick="loadComments(this)" data-comment-id="${topLevelComment.id}">
                            Replies(${comment.snippet.totalReplyCount})
                        </button>
                    </div>
                </div>
            `;
    commentsContainer.append(commentElement);
  }
}

async function loadComments(element) {
  const commentId = element.getAttribute("data-comment-id");
  console.log(commentId);
  let endpoint = `https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=${commentId}&key=${apiKey1}`;
  try {
    const response = await fetch(endpoint);
    const result = await response.json();
    const parentNode = element.parentNode.parentNode;
    let commentsList = result.items;
    for (let i = 0; i < commentsList.length; i++) {
      let replyComment = commentsList[i];
      let commentNode = document.createElement("div");
      commentNode.className = "comment comment-reply";

      commentNode.innerHTML = `
                        <img src="${replyComment.snippet.authorProfileImageUrl}" alt="">
                        <div class="comment-right-half">
                            <b>${replyComment.snippet.authorDisplayName}</b>
                            <p>${replyComment.snippet.textOriginal}</p>
                            <div class="options">
                                <div class="like">
                                    <span class="material-icons">thumb_up</span>
                                    <span>${replyComment.snippet.likeCount}</span>
                                </div>
                                <div class="like">
                                    <span class="material-icons">thumb_down</span>
                                </div>
                            </div>
                    `;

      parentNode.append(commentNode);
    }
  } catch (error) {
    console.log("Can't load comment: " + error);
  }
}

let recommendedSectionDiv = document.getElementById("recommendedVideo");
async function getRecommendedVideos(videoTitle) {
  try {
    let response = await fetch(
      `${BASE_URL}/search?key=${apiKey1}&q=${videoTitle}&maxResults=16&part=snippet`
    );
    let data = await response.json();
    let arr = data.items;
    displayRecommendedData(arr);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
async function getVideoInfo(videoId) {
  let response = await fetch(
    `${BASE_URL}/videos?key=${apiKey1}&part=statistics&id=${videoId}`
  );
  let data = await response.json();
  return data.items;
}

async function getChannelLogo(channelId) {
  const response = await fetch(
    `${BASE_URL}/channels?key=${apiKey1}&part=snippet&id=${channelId}`
  );
  const data = await response.json();

  return data.items;
}
function calDuration(publisedDate) {
    let publisedAt=new Date();
  let timelapse = publisedAt - publisedDate;
  var seconds = Math.floor(timelapse / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var weeks = Math.floor(days / 7);
  var months = Math.floor(days / 30);
  var years = Math.floor(days / 365);

  if (years > 0) {
    return years + (years === 1 ? " year ago" : " years ago ");
  } else if (months > 0) {
    return months + (months === 1 ? " month ago" : " months ago");
  } else if (weeks > 0) {
    return weeks + (weeks === 1 ? " week ago" : " weeks ago");
  } else if (days > 0) {
    return days + (days === 1 ? " day ago" : " days ago");
  } else if (hours > 0) {
    return hours + (hours === 1 ? " hour ago" : " hours ago");
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
  } else {
    return seconds + (seconds === 1 ? " second ago" : " seconds ago");
  }
}

function calculateViews(n) {
  if (n < 1000) return n;

  if (n <= 999999) {
    n /= 1000;
    n = parseInt(n);
    return n + "K";
  }
  return parseInt(n / 1000000).toFixed(1) + "M";
}

async function displayRecommendedData(data) {
  console.log("erf");
  recommendedSectionDiv.innerHTML = "";
  for (const ele of data) {
    console.log(ele);

    let viewCountObj = await getVideoInfo(videoId);
    console.log(viewCountObj);
    ele.viewObject = viewCountObj;
    let channelInfoObject = await getChannelLogo(ele.snippet.channelId);
    console.log(channelInfoObject);
    ele.channelObject = channelInfoObject;
    let displayDuration = calDuration(ele.snippet.publishedAt);
    let recommendedVideoCard = document.createElement("div");
    recommendedVideoCard.className = "recommenedvideoCard";
    recommendedVideoCard.innerHTML = `<img src="${
      ele.snippet.thumbnails.high.url
    }">
    <div>
    <div class="channel">
        <h4>${ele.snippet.title}</h4>
    </div>
    <div>
        <p>${ele.snippet.channelTitle}</p>
        <p> ${calculateViews(
          ele.viewObject[0].statistics.viewCount
        )} views , ${displayDuration} ago </p>
    </div>
    </div>`;
    recommendedSectionDiv.appendChild(recommendedVideoCard);
  }
}
