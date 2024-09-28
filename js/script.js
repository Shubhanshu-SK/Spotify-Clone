console.log("start javascript");

const currentSong = new Audio()
var songs;
let currFolder;
// for song button to appear
function song_visibility() {
    x = document.querySelector('#box_in_scroll_1');
    y = document.querySelector('#box_in_scroll_2');
    z = document.querySelector('#song_in_your_lib');
    if (x.style.display !== "none") {
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "block";
    }
    else {
        x.style.display = "block";
        y.style.display = "block";
        z.style.display = "none";
    }
    // my_lib.style.color = "red"

}

async function getsongs(folder = "/") {
    let a = await fetch(`/songs${folder}`);
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    // console.log(as)
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }

    let songUL = document.querySelector('.your_lib_song_ul')
    songUL.innerHTML = ""
    // console.log(songs)
    for (const song of songs) {
        songName = song.split(`/songs${currFolder}`)[1]
        songUL.innerHTML = songUL.innerHTML + `<li> <span class = "info">${songName.replaceAll("%20", " ")}</span> </li>`;
    }
    playMusic(songs[0].split(`${currFolder}`)[1], true)
    play_which_song()
}

const playMusic = async (song_name, pause = false) => {
    let win_sonng_name = document.querySelector(".song_in_play_bar")
    if (song_name.includes("%20")) {
        // console.log(song_name)
        song_href = `/songs${currFolder}` + song_name
        win_sonng_name.innerHTML = `${song_name.replaceAll("%20", ' ').replace("/songs/", '')}`;
    } else {
        song_href = `/songs${currFolder}` + song_name.split(" ").join("%20")
        win_sonng_name.innerHTML = `${song_name}`;
    }

    // console.log(song_href)  
    currentSong.src = song_href
    if (pause == false) {
        currentSong.play()
    } else {
        currentSong.pause()
    }
    return songs
    // console.log(currentSong.duration)
}

// display all the folder 
async function display_albums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let all_as = div.getElementsByTagName("a")

    let array = Array.from(all_as)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/songs")[1]
            //   Get metadata of all folder
            let a = await fetch(`/songs${folder}info.json`);
            let response = await a.json();
            // console.log(response.description)
            spotify_playlist = document.querySelector(".spotify_playlist")
            spotify_playlist.innerHTML = spotify_playlist.innerHTML + ` 
                        <div class="card_container border" data-folder="${folder.replaceAll("/", '')}">

                            <div class="contain_card_img">
                                <img src="/songs${folder}cover_pg.jpg" alt="">
                            </div>
                            <div class="contain_about_card">
                                <div class="card_title">
                                    ${response.title}
                                </div>
                                <span class="about_card">
                                    ${response.description}
                                </span>
                            </div>
                            <div class="play_button_ani">
                                <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="44" color="#000000" fill="green">
                                    <circle cx="12" cy="12" r="10" stroke="green" stroke-width="1.5" />
                                    <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black" />
                                </svg>
                            </div>

                        </div>  `
        }
    }

    Array.from(document.getElementsByClassName("card_container")).forEach(card => {
        card.addEventListener("click", async e => {
            
            console.log(e.currentTarget.dataset.folder)
            currFolder = "/" + e.currentTarget.dataset.folder + "/"
            document.querySelector("#box_in_scroll_1").style.display = "none"
            document.querySelector("#box_in_scroll_2").style.display = "none"
            document.querySelector("#song_in_your_lib").style.display = "block"
            document.querySelector("#song_time_line_bar").style.width = "0%"
            await getsongs(currFolder)

        })
    })
    // play_which_song()
}

// eventlistener on every song li
function play_which_song() {
    Array.from(document.querySelector(".your_lib_song_ul").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            song_name = e.querySelector(".info").innerHTML
            // console.log(e.querySelector(".info").innerHTML)
            playMusic(song_name)
        })
    })
}
// onclick play and pause 
function play_bt() {
    if (currentSong.paused) {
        currentSong.play()
        document.addEventListener("click",e=>{
            e.target.src = e.target.src.replace("pause.svg","play.svg")
        })
        
    } else {
        currentSong.pause()
        document.addEventListener("click",e=>{
            e.target.src = e.target.src.replace("play.svg","pause.svg")
        })
    }
}

// onclick previous 
function previous_bt() {
    songs.filter((e, ind) => {
        if (e == currentSong.src) {
            if (ind != 0) {
                playMusic(songs[ind - 1].split(`${currFolder}`)[1])
            } else {
                playMusic(songs[songs.length - 1].split(`${currFolder}`)[1])
            }
        }
    })
    // console.log(pre_song)

}
// onclick next
function next_bt() {
    new Promise((resolve) => {
        songs.filter((e, ind) => {
            if (e == currentSong.src) {
                if (ind != songs.length - 1) {
                    resolve(ind + 1)
                } else {
                    resolve(0)
                }
            }
        })
    }).then(n_ind => {
        playMusic(songs[n_ind].split(`${currFolder}`)[1])
    })
}

function view_left() {
    left = document.querySelector(".left")
    left.style.left = "0%"
}



async function main() {
    // get the list of all songs
    currFolder = "/1_song_folder/"
    await getsongs(currFolder)
    // console.log(songs)
    play_which_song()
    display_albums()
    // card playlist selection
    

    let time = document.querySelector(".current_time")
    let seek_bar = document.querySelector(".audio_comp_line")
    let bar_length = seek_bar.querySelector(".song_time_line_bar")
    // to change song time
    seek_bar.addEventListener("click", e => {
        new_len = ((e.offsetX / (e.target.getBoundingClientRect().width)) * 100)
        bar_length.style.width = new_len + "%"
        // console.log(new_len)
        // console.log(e)
        currentSong.currentTime = (currentSong.duration * new_len) / 100
    })

    // to show current time and duration of the song
    currentSong.addEventListener("timeupdate", () => {
        let timing = (currentSong.currentTime / 60).toFixed(2) + '/' + (currentSong.duration / 60).toFixed(2);
        time.innerHTML = timing.replaceAll(".", ":")
        bar_length.style.width = `${((currentSong.currentTime / currentSong.duration) * 100)}% `;
    })
    // cross bt
    document.querySelector(".cross_left").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // to set sound
    document.querySelector(".sound_act").getElementsByTagName("input")[0].addEventListener("change", e => {
        currentSong.volume = e.target.value / 100
        // console.log(e)
    })
    // replacing mute and unmute svg
    document.querySelector('.sound_act').getElementsByClassName("sound_img")[0].addEventListener("click", e => {
        input = document.querySelector("#sound_range")
        // console.log(e.target.src.includes("sound.svg"))
        if (e.target.src.includes("sound.svg")) {
            // console.log("hiiiii")
            e.target.src = e.target.src.replace("sound.svg", "mute.svg")
            currentSong.volume = 0
            // console.log(e.target)
            input.value = 0
        } else {
            e.target.src = e.target.src.replace("mute.svg", "sound.svg")
            currentSong.volume = 0.5
            input.value = 50
        }
    })
}


main()