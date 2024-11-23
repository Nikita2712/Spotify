console.log("lets play song");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  // Calculate minutes and remaining seconds
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  // Use padStart to add leading zeros if necessary
  var formattedMinutes = String(minutes).padStart(2, "0");
  var formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes} : ${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" width="34" src="music.svg" alt="">
                          <div class="info">
                              <div> ${song.replaceAll("%20", " ")}</div>
                              <div>Harry</div>
                          </div>
                          <div class="playnow">
                              <span>Play Now</span>
                              <img class="invert" src="play.svg" alt="">
                          </div> </li>`;
  }

  // Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  //all songs list
  await getSongs("songs/ncs");
  playMusic(songs[0], true);

  //attach an event listener to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  // listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // add an event listener for close  button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //add an event listener to previous  and next
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  //add an event listener to next
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("setting the volume to", e.target.value, "/ 100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  //load the playlist whenever card is clicked
  document.getElementsByClassName(".card").forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/`);
    });
  });
}
main();
