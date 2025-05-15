let currentSong = new Audio();
let songs;
let currfolder;

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/SpotifyClone/songs/${folder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(decodeURIComponent(element.href.split(`${folder}/`)[1]));
    }
  }
  return songs;
}

function secondsToMinutesSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

const playmusic = (track, pause = false) => {
  currentSong.src = `/SpotifyClone/songs/${currfolder}/${track}`;
  if (!pause) {
    currentSong.play();
    play.src = "/SpotifyClone/img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function loadAndDisplaySongs(folder) {
  songs = await getSongs(folder);

  if (songs.length > 0) {
    playmusic(songs[0], true);

    // Update the song list in UI
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const song of songs) {
      songUL.innerHTML += `<li><img class="invert" width="34" src="/SpotifyClone/img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Shivangi</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="/SpotifyClone/img/play.svg" alt="">
        </div></li>`;
    }

    // Add click listeners to each song
    Array.from(
      document.querySelector(".songList").getElementsByTagName("li")
    ).forEach((e) => {
      e.addEventListener("click", () => {
        playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
      });
    });
  } else {
    alert("No songs found in the selected folder.");
  }
}

async function displayAlbums() {
  console.log("displaying albums");
  let a = await fetch(`/SpotifyClone/songs`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").filter(Boolean).pop();

      // ✅ Skip base "songs" folder itself
      if (folder.toLowerCase() === "songs") {
        console.warn(`Skipping root folder "${folder}"`);
        continue;
      }

      try {
        let a = await fetch(`/SpotifyClone/songs/${folder}/info.json`);
        let response = await a.json();

        cardContainer.innerHTML += ` 
          <div data-folder="${folder}" class="card">
            <div class="play"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                                <circle cx="24" cy="24" r="24" fill="green" />
                                <path d="M17 34V14L35 24L17 34Z" stroke="#000000" stroke-width="2" stroke-linejoin="round" fill="none" />
                            </svg></div>
            <img src="/SpotifyClone/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
          </div>`;
      } catch (err) {
        console.warn(
          `Skipping folder "${folder}" due to missing/invalid info.json`
        );
      }
    }
  }

  // Card click listeners
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      let folder = item.currentTarget.dataset.folder;
      await loadAndDisplaySongs(folder);
      playmusic(songs[0]);
    });
  });
}

async function main() {
  await loadAndDisplaySongs("ncs"); // default load

  // Display albums
  displayAlbums();

  // Play/pause button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/SpotifyClone/img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/SpotifyClone/img/play.svg";
    }
  });

  // Time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Seekbar click
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Hamburger menu
  document
    .querySelector(".hamburgerContainer")
    .addEventListener("click", () => {
      document.querySelector(".left").style.left = "0";
    });

  // Previous
  previous.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index > 0) {
      playmusic(songs[index - 1]);
    }
  });

  // Next
  next.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index < songs.length - 1) {
      playmusic(songs[index + 1]);
    }
  });

  // Volume control
  document.querySelector(".range input").addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume > 0) {
      document.querySelector(".volume>img").src = document
        .querySelector(".volume>img")
        .src.replace(
          "/SpotifyClone/img/mute.svg",
          "/SpotifyClone/img/volume.svg"
        );
    }
  });
}

// Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click", (e) => {
  if (e.target.src.includes("/SpotifyClone/img/volume.svg")) {
    e.target.src = e.target.src.replace(
      "/SpotifyClone/img/volume.svg",
      "/SpotifyClone/img/mute.svg"
    );
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  } else {
    e.target.src = e.target.src.replace(
      "/SpotifyClone/img/mute.svg",
      "/SpotifyClone/img/volume.svg"
    );
    currentSong.volume = 0.1;
    document
      .querySelector(".range")
      .getElementsByTagName("input")[0].value = 10;
  }
});

main();
