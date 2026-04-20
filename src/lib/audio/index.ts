export * from "./beeps";
export { getAudioContext, resumeAudio } from "./context";

export const INTRO_MUSIC_SRC = "/audio/arcade-music-intro.mp3";

export const MUSIC_TRACKS: readonly string[] = [
  "/audio/arcade-music-intro.mp3",
  "/audio/song-classic.mp3",
  "/audio/song-classic-2.mp3",
  "/audio/song-classic-3.mp3",
  "/audio/song-classic-4.mp3",
];
