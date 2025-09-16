import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import YouTube from 'react-youtube';
import React, { useState } from 'react';
import './AppLayout.css';

const AppLayout = () => {
  // Persistent Study Music Player (react-youtube)
  const [musicPaused, setMusicPaused] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [player, setPlayer] = useState(null);
  const [playlistIdx, setPlaylistIdx] = useState(0);
  const playlists = [
    { name: 'Lofi Hip Hop', videoId: 'jfKfPfyJRdk', playlist: 'jfKfPfyJRdk' },
    { name: 'Chill Beats', videoId: 'DWcJFNfaw9c', playlist: 'DWcJFNfaw9c' },
    { name: 'Jazz Vibes', videoId: 'kgx4WGK0oNU', playlist: 'kgx4WGK0oNU' },
    { name: 'Focus Music', videoId: 'WPni755-Krg', playlist: 'WPni755-Krg' },
    { name: 'Classical Study', videoId: 'GRxofEmo3HA', playlist: 'GRxofEmo3HA' },
  ];
  const onReady = (event) => {
  setPlayer(event.target);
  // Do not auto-play on ready
  event.target.pauseVideo();
  };
  const handleMusicPause = () => {
    if (player) {
      player.pauseVideo();
      setMusicPaused(true);
    }
  };
  const handleMusicPlay = () => {
    if (player) {
      player.playVideo();
      setMusicPaused(false);
    }
  };
  // Apply smooth scrolling behavior for the entire app
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="apple-layout">
      <Navbar />
      <main className="apple-main">
        <Outlet />
      </main>
      <Footer />
      {/* Persistent Study Music Player (react-youtube) */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9999,
        width: '340px',
        minHeight: '72px',
        background: `url('https://img.youtube.com/vi/${playlists[playlistIdx].videoId}/hqdefault.jpg') center/cover, rgba(255,255,255,0.65)`,
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(52,199,89,0.13)',
        padding: '0.7rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        backdropFilter: 'blur(10px)',
        border: '1.2px solid rgba(52,199,89,0.18)',
        transition: 'box-shadow 0.2s',
        overflow: 'hidden',
        position: 'fixed',
      }}>
        <YouTube
          videoId={playlists[playlistIdx].videoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              loop: 1,
              playlist: playlists[playlistIdx].playlist,
            },
          }}
          onReady={onReady}
        />
        <button
          onClick={musicPaused ? handleMusicPlay : handleMusicPause}
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: '12px',
            border: 'none',
            background: musicPaused ? 'linear-gradient(90deg,#34c759,#5ef38c)' : 'linear-gradient(90deg,#ff375f,#ff8fa3)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(52,199,89,0.10)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = musicPaused ? '#34c759' : '#ff375f'}
          onMouseOut={e => e.currentTarget.style.background = musicPaused ? 'linear-gradient(90deg,#34c759,#5ef38c)' : 'linear-gradient(90deg,#ff375f,#ff8fa3)'}
        >
          {musicPaused ? 'Play' : 'Pause'}
        </button>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          <select
            value={playlistIdx}
            onChange={e => setPlaylistIdx(Number(e.target.value))}
            style={{
              fontSize: '1rem',
              borderRadius: '18px',
              border: '1.5px solid rgba(180,180,180,0.18)',
              padding: '0.6rem 2.2rem 0.6rem 1.2rem',
              background: 'rgba(255,255,255,0.25)',
              color: '#222',
              fontWeight: 600,
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
              outline: 'none',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'border 0.2s, box-shadow 0.2s',
              appearance: 'none',
              cursor: 'pointer',
              borderBottom: '2.5px solid #bbb',
            }}
          >
            {playlists.map((pl, idx) => (
              <option key={pl.videoId} value={idx} style={{ background: 'rgba(255,255,255,0.95)', color: '#222', fontWeight: 600 }}>{pl.name}</option>
            ))}
          </select>
          <span style={{
            position: 'absolute',
            right: '1.2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            fontSize: '1.2rem',
            color: '#bbb',
            opacity: 0.7,
            textShadow: '0 1px 4px rgba(0,0,0,0.10)',
          }}>▼</span>
        </div>
        <button
          onClick={() => setShowControls(v => !v)}
          style={{
            padding: '0.3rem 0.7rem',
            borderRadius: '50%',
            border: 'none',
            background: '#e0e0e0',
            color: '#34c759',
            fontWeight: 700,
            fontSize: '1.2rem',
            boxShadow: '0 1px 4px rgba(52,199,89,0.07)',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          title="More controls"
          onMouseOver={e => e.currentTarget.style.background = '#34c759'}
          onMouseOut={e => e.currentTarget.style.background = '#e0e0e0'}
        >
          ⋮
        </button>
        {showControls && (
          <div style={{
            display: 'flex',
            gap: '0.3rem',
            alignItems: 'center',
            marginLeft: '0.5rem',
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(52,199,89,0.10)',
            padding: '0.7rem 1rem',
          }}>
            <button onClick={() => player && player.mute()} style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', border: 'none', background: '#eee', color: '#34c759', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px rgba(52,199,89,0.07)' }}>Mute</button>
            <button onClick={() => player && player.unMute()} style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', border: 'none', background: '#eee', color: '#34c759', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px rgba(52,199,89,0.07)' }}>Unmute</button>
            <button onClick={() => player && player.setVolume(Math.min(100, (player.getVolume() || 50) + 10))} style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', border: 'none', background: '#eee', color: '#34c759', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px rgba(52,199,89,0.07)' }}>Vol+</button>
            <button onClick={() => player && player.setVolume(Math.max(0, (player.getVolume() || 50) - 10))} style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', border: 'none', background: '#eee', color: '#34c759', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px rgba(52,199,89,0.07)' }}>Vol-</button>
            <button onClick={() => player && player.seekTo((player.getCurrentTime() || 0) - 10, true)} style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', border: 'none', background: '#eee', color: '#34c759', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px rgba(52,199,89,0.07)' }}>⏪ 10s</button>
            <button onClick={() => player && player.seekTo((player.getCurrentTime() || 0) + 10, true)} style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', border: 'none', background: '#eee', color: '#34c759', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 4px rgba(52,199,89,0.07)' }}>⏩ 10s</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppLayout;