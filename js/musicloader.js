//fetch JSON data and rendeer music containers



fetch('./data/musicloader.json')
.then(response=> response.json())
.then(tracks=>{
    const musicContainer=document.getElementById('music-player');
    musicContainer.innerHTML=""; //clear old data

    tracks.forEach(track=>{
        const trackCard=document.createElement('div');

        document.createElement('div');
           trackCard.classList.add('track-card');

           trackCard.innerHTML=`
           <div class="music-player">
           <h2>Now Playing<h2>
           <img src="${track.cover}" alt="${track.title} cover" />

           <h3>${track.title}</h3>
           <p>${track.artist}</p>

           <div class="controls">
            <div class="controls">
              <button><img src="./icons/heart.svg" id="like"></button>
              
              <audio controls id="controls" >
                <source src="audio/Good_vibes-Maze_28(1).mp3" type="audio/mp3">
                Your browser does not support the audio element.
            </audio>
            <button class="controls"><img src="./icons/share.svg" id="like"></button>
          </div>
           </div>
           `;
           musicContainer.appendChild(trackCard);

    });
})

.catch(error=> console.error('Error loading music: ',error));