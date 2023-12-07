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


const API_KEY="AIzaSyAyBVobRZdsqv8hb0R5w6pRAds5NWAw1Zo";
const BASE_URL = "https://www.googleapis.com/youtube/v3";


async function fetchVideos(searchQuery, maxResults) {
  const response = await fetch(
    `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
  );
  const data = await response.json();
  localStorage.setItem("data",JSON.stringify(data.items))
}
fetchVideos("music",12)



async function getChannelLogo(channelId){
  // https://www.googleapis.com/youtube/v3/channels?key=AIzaSyBmOfUnRNYc22e04ZmK79uRbPb6388K9AE&part=snippet&id=UC8Wd_RVw8T1O1_IWEbICkIg
  const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
  const data = await response.json();
  // console.log(data);
  localStorage.setItem("data2",JSON.stringify(data))
}

async function getVideoStats(videoId){
  // https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBmOfUnRNYc22e04ZmK79uRbPb6388K9AE&part=statistics&id=JhIBqykjzbs
  const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`);
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

  


