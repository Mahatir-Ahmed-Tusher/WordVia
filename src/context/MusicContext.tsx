"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

interface MusicContextType {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const MUSIC_STORAGE_KEY = 'wordvia_music_settings';
const DEFAULT_VOLUME = 0.22; // Default volume (22%)

interface MusicSettings {
  isMuted: boolean;
  volume: number;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted to respect autoplay policy
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MUSIC_STORAGE_KEY);
      if (saved) {
        const settings: MusicSettings = JSON.parse(saved);
        setIsMuted(settings.isMuted);
        setVolumeState(settings.volume);
      }
    } catch (error) {
      console.error('Error loading music settings:', error);
    }
  }, []);

  // Initialize audio (only once on mount)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio('/WordVia-bgm-massobeats-rose water.mp3');
    audio.loop = true;
    audioRef.current = audio;

    // Try to play after user interaction
    const handleUserInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };

    // Listen for user interactions
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update audio when mute state changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.pause();
    } else {
      if (hasInteracted) {
        audioRef.current.play().catch((error) => {
          console.error('Error playing music:', error);
        });
      }
    }
  }, [isMuted, hasInteracted]);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      const settings: MusicSettings = { isMuted, volume };
      localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving music settings:', error);
    }
  }, [isMuted, volume]);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (!newMuted && !hasInteracted) {
        // User wants to unmute, trigger interaction
        setHasInteracted(true);
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.error('Error playing music:', error);
          });
        }
      }
      return newMuted;
    });
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    // If unmuting by setting volume, also unmute
    if (clampedVolume > 0 && isMuted) {
      setIsMuted(false);
      setHasInteracted(true);
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error('Error playing music:', error);
        });
      }
    }
  };

  return (
    <MusicContext.Provider value={{ isMuted, volume, toggleMute, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}

