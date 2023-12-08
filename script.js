const leftScroll=document.getElementById("leftScroll")
const rightScroll = document.getElementById("rightScroll");
const topMainBody = document.getElementById("topMainBody");
const cardContainer=document.getElementById("cardContainer")

let originalScrollPosition = topMainBody.scrollLeft;  
leftScroll.onclick = function () {
    topMainBody.scrollLeft += 30;
    rightScroll.classList.remove("hide");
};

rightScroll.onclick = function () {
    topMainBody.scrollLeft -= 30;
};

topMainBody.addEventListener('scroll', function () {
    if (topMainBody.scrollLeft === originalScrollPosition) {
        rightScroll.classList.toggle('hide');
}});


const apiKey="AIzaSyAyBVobRZdsqv8hb0R5w6pRAds5NWAw1Zo";
localStorage.setItem("api_Key", apiKey);
const BASE_URL = "https://www.googleapis.com/youtube/v3";


async function fetchVideos(searchQuery, maxResults) {
  const response = await fetch(
    `${BASE_URL}/search?key=${apiKey}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
  );
  const data = await response.json();
  localStorage.setItem("data",JSON.stringify(data.items))
}
fetchVideos("music",12)



async function getChannelLogo(channelId){
  // https://www.googleapis.com/youtube/v3/channels?key=AIzaSyBmOfUnRNYc22e04ZmK79uRbPb6388K9AE&part=snippet&id=UC8Wd_RVw8T1O1_IWEbICkIg
  const response = await fetch(`${BASE_URL}/channels?key=${apiKey}&part=snippet&id=${channelId}`);
  const data = await response.json();
  // console.log(data);
  localStorage.setItem("data2",JSON.stringify(data))
}

async function getVideoStats(videoId){
  // https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBmOfUnRNYc22e04ZmK79uRbPb6388K9AE&part=statistics&id=JhIBqykjzbs
  const response = await fetch(`${BASE_URL}/videos?key=${apiKey}&part=statistics&id=${videoId}`);
  const data = await response.json();
  // console.log(data);
  localStorage.setItem("data3",JSON.stringify(data))
  // displayView(data.items[0].statistics.viewCount)
}

let dta=JSON.parse(localStorage.getItem("data"));
console.log(dta);


let divIds=[];
let divLogo=[];

function renderAll(){
 
  for (let i = 0; i < dta.length; i++) {
    getChannelLogo(dta[i].snippet.channelId)
    let dta2=JSON.parse(localStorage.getItem("data2"));
    getVideoStats(dta[i].id.videoId)
    let dta3=JSON.parse(localStorage.getItem("data3"));
    // console.log(dta3.items[0].statistics.viewCount);
    // console.log(dta2.items[0].snippet.thumbnails.default.url);
    let currentDate = new Date();
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div id="${dta[i].id.videoId}">
      </div>
      <div>
      <img src=${dta2.items[0].snippet.thumbnails.default.url}>
      <div>
        <span>${dta[i].snippet.description}</span>
        <span>${dta[i].snippet.channelTitle}</span>
        <span>${getViews(dta3.items[0].statistics.viewCount)}</span>
        <span>${calcTime(currentDate, new Date(dta[i].snippet.publishedAt))}</span>
        </div>
      </div>
    `;

    cardContainer.appendChild(card); // Append the card to the container

   divIds.push(dta[i].id.videoId)
 
  }
}
function getViews(n){
  if(n < 1000)
      return n ;

  if(n <= 999999){
      n /= 1000;
      n = parseInt(n);
      return n + "K" ;
  }
  return parseInt(n / 1000000).toFixed(1) + "M" ;
}

// function displayView(data){
//     const spanDiv=document.createElement("span");
//  let views=getViews(data)
//     span.innerText=views;
//   const lastDivInCard = document.getElementById("test");
//   lastDivInCard.appendChild(spanDiv);
// }

const searchInput=document.getElementById("search");
const searchButton=document.getElementById("searchIconDiv")
const container = document.getElementById("container");
// searchButton.addEventListener("click",searchFun);
// function searchFun() {
//   cardContainer.innerHTML="";
//   let searchVal=searchInput.value
//   // if(searchVal==""){
//   //   fetchVideos("music",12)
//   //   re
//   // }else{
//   //   fetchVideos(searchVal,12)
//   // }
// }
// renderAll();
window.addEventListener("load", () => {
  // we need to write logic for rendering video player
  // iframe

  renderAll()
  divIds.forEach((item) => {
    let videoId =String(item);
    // console.log(videoId);
    if(videoId!=undefined){
    if (YT) {
      new YT.Player(videoId, {
        height: "155",
        width: "276",
        videoId: videoId,
      });
    }
  }
  });
});


function calcTime (curr,old) {
  let timelapse= curr-old;


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


function searchVideos() {
  cardContainer.innerHTML="";
  let searchValue = searchInput.value;
  if(searchValue == "")
    fetchVideos2("MP");
  fetchVideos2(searchValue);
}
searchButton.addEventListener("click",searchVideos);
async function fetchVideos2(query) {
  let apiEndPoint;
  if(query == "MP") {
    apiEndPoint = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&key=${apiKey}`
  }
  apiEndPoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query}&key=${apiKey}`;

  try {
      let response = await fetch(apiEndPoint);
      let result = await response.json();

      for(let i = 0; i<result.items.length; i++) {
        let video = result.items[i];
          let videoStats = await fetchStats(video.id.videoId)
          if(videoStats.items.length > 0)
              result.items[i].videoStats = videoStats.items[0].statistics; 
          result.items[i].duration = videoStats.items[0] && videoStats.items[0].contentDetails.duration;
      }
      showThumbNails2(result.items);
  }
  catch(error) {
      console.log("Something went wrong: " + error);
  }
}


function showThumbNails2(items) {
  container.innerHTML = "";


  for (let i=0; i<items.length; i++) {
    let videoItem = items[i];
    let imageUrl = videoItem.snippet.thumbnails.high.url;
    let videoElement = document.createElement("div");

    videoElement.classList.add('video-content');
    videoElement.addEventListener("click", () => {
      navigateToVideo(videoItem.id.videoId);
    });

    let videoChildren = `
        <a href="#" class="visual">
          <img src="${imageUrl}" class="thumbnail"/>
          <b>${formatDuration(videoItem.duration)}</b>
        </a>
        <div class="details flex-div">
          <img src="user1.png">
          <div>
            <div class="title">
              <a href="#">${videoItem.snippet.title}</a>
            </div>
            <div>
              <p class="channel-name">${videoItem.snippet.channelTitle}</p>
              <p class="view-count">${videoItem.videoStats ? getViews(videoItem.videoStats.viewCount) + " views": "NA"}</p>
            </div>
          </div>
        </div>
    `;
    videoElement.innerHTML = videoChildren ;
    container.append(videoElement);
  }
}
function navigateToVideo(videoId){
  let path = `video.html`;
  if(videoId){

    document.cookie = `video_id=${videoId}; path=${path}`;
    let linkItem = document.createElement("a");
    linkItem.href = "http://127.0.0.1:5501/video.html"
    linkItem.target = "_blank";
    linkItem.click();
  }
  else {
    alert("Can't load the video: Watch it on YouTube")
  }
}


function formatDuration(duration) {
  if(!duration) return "NA" ;

  let str = duration.replace("PT", "");
  str = str.replace("H", ":");
  str = str.replace("M", ":");
  if(str == str.replace("S","")) {
    str += "00";
  }
  else
    str = str.replace("S", "");
  return str ;
}

async function fetchStats(videoId){ 
  const endpoint = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=statistics,contentDetails&id=${videoId}`;
  let response = await fetch(endpoint); 
  let result = await response.json();
  return result ;
}



  


