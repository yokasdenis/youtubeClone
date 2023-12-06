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


const API_KEY="AIzaSyDADh9Tks_KcpyjmnyqDLAiIrvpjW8QVAo";
const BASE_URL = "https://www.googleapis.com/youtube/v3";


async function fetchVideos(searchQuery, maxResults) {
  const response = await fetch(
    `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
  );
  const data = await response.json();
  localStorage.setItem("data",JSON.stringify(data.items))
}
fetchVideos("music",15);


// async function getChannelLogo(channelId){
//   // https://www.googleapis.com/youtube/v3/channels?key=AIzaSyBmOfUnRNYc22e04ZmK79uRbPb6388K9AE&part=snippet&id=UC8Wd_RVw8T1O1_IWEbICkIg
//   const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
//   const data = await response.json();
//   // console.log(data);
//   localStorage.setItem("data2",JSON.stringify(data.items))
// }
async function getVideoStats(videoId){
  // https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBmOfUnRNYc22e04ZmK79uRbPb6388K9AE&part=statistics&id=JhIBqykjzbs
  const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`);
  const data = await response.json();
  console.log(data);
  localStorage.setItem("data3",JSON.stringify(data.item))
}

let dta=JSON.parse(localStorage.getItem("data"));
console.log(dta);
// let dta2=JSON.parse(localStorage.getItem("data2"));
let dta3=JSON.parse(localStorage.getItem("data3"));
// console.log(dta3);
let divIds=[];

function renderAll(){

  for (let i = 0; i < dta.length; i++) {
    // getChannelLogo(dta[i].snippet.channelId)
    // console.log(dta2);
    // getVideoStats(String(dta[i].id.videoId))
    // console.log(dta3);
    let currentDate = new Date();
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div id="${dta[i].id.videoId}">
      </div>
      <div>
        ${dta[i].snippet.description}
        ${dta[i].snippet.channelTitle}
        ${calcTime(currentDate, new Date(dta[i].snippet.publishedAt))}
      </div>
    `;

    cardContainer.appendChild(card); // Append the card to the container

   divIds.push(dta[i].id.videoId)
  }
}


window.addEventListener("load", () => {
  // we need to write logic for rendering video player
  // iframe
  renderAll();
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
    return years + (years === 1 ? " year" : " years");
  } else if (months > 0) {
    return months + (months === 1 ? " month" : " months");
  } else if (weeks > 0) {
    return weeks + (weeks === 1 ? " week" : " weeks");
  } else if (days > 0) {
    return days + (days === 1 ? " day" : " days");
  } else if (hours > 0) {
    return hours + (hours === 1 ? " hour" : " hours");
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? " minute" : " minutes");
  } else {
    return seconds + (seconds === 1 ? " second" : " seconds");
  }

}

  


