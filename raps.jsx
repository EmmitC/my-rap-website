// App.jsx
import React, { useEffect, useState } from 'react';
import './App.css';

const Header = ({ onToggle }) => (
  <header className="header">
    <div className="hamburger" onClick={onToggle}>&#9776;</div>
    <h1>Take a Listen to Some of My Works</h1>
    <h3>Verses I've Written While Honing My Craft</h3>
    <nav id="navLinks">
      <a href="/">Home</a>
    </nav>
  </header>
);

const MusicPlayer = ({ title, src, type = 'audio/mp3' }) => (
  <div className="music-player">
    {title && <h3>{title}</h3>}
    <audio controls>
      <source src={src} type={type} />
      Your browser does not support the audio element.
    </audio>
  </div>
);

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const countDownDate = new Date('Dec 31, 2024 23:59:59').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeRemaining = countDownDate - now;

      if (timeRemaining < 0) {
        clearInterval(interval);
        setTimeLeft('Countdown Finished!');
        return;
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="countdown">
      <h2>New Album Release</h2>
      <p id="timer">{timeLeft}</p>
    </div>
  );
};

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    const nav = document.getElementById('navLinks');
    if (nav) nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
  };

  return (
    <div className="App">
      <Header onToggle={toggleMenu} />

      <div className="container">
        <div className="music-player">
          <h2>Now Playing</h2>
          <MusicPlayer src="audio/Good_vibes-Maze_28(1).mp3" />
        </div>

        <div className="playlist">
          <h2>Other Songs</h2>
          <MusicPlayer title="Melodies by Maze 28" src="audio/melodies_by_maze_28.m4a" type="audio/m4a" />
          <MusicPlayer title="Nirvana" src="audio/nirvana_maze_28.mp3" />
          <MusicPlayer title="Aggressor" src="audio/Aggressor_cut.mp3" />
        </div>

        <Countdown />
      </div>

      <footer>
        <p>&copy; 2025 Maze the 28th. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
