import { Audio } from "expo-av";
import { create } from "zustand";

// Types
interface Track {
	id: string;
	title: string;
	artist: string;
	cover: string;
	uri: string;
	duration: number; // in seconds
}

interface AudioState {
	// State
	sound: Audio.Sound | null;
	currentTrack: Track | null;
	isPlaying: boolean;
	isLoading: boolean;
	position: number; // in milliseconds
	duration: number; // in milliseconds
	volume: number;
	isFavorite: boolean;
	isShuffle: boolean;
	repeatMode: "off" | "all" | "one";
	queue: Track[];
	currentIndex: number;

	// Actions
	initializeAudio: () => Promise<void>;
	loadTrack: (track: Track) => Promise<void>;
	play: () => Promise<void>;
	pause: () => Promise<void>;
	seekTo: (positionMillis: number) => Promise<void>;
	setVolume: (volume: number) => Promise<void>;
	toggleFavorite: () => void;
	toggleShuffle: () => void;
	setRepeatMode: (mode: "off" | "all" | "one") => void;
	toggleRepeat: () => void;
	setQueue: (tracks: Track[]) => void;
	playNext: () => Promise<void>;
	playPrevious: () => Promise<void>;
	handleTrackEnd: () => Promise<void>;
	updatePosition: (position: number) => void;
	cleanup: () => Promise<void>;
}

// Audio Store
export const useAudioStore = create<AudioState>((set, get) => ({
	// State
	sound: null,
	currentTrack: null,
	isPlaying: false,
	isLoading: false,
	position: 0,
	duration: 0,
	volume: 1.0,
	isFavorite: false,
	isShuffle: false,
	repeatMode: "off",
	queue: [],
	currentIndex: 0,

	// Actions
	initializeAudio: async () => {
		try {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: false,
				staysActiveInBackground: true,
				playsInSilentModeIOS: true,
				shouldDuckAndroid: true,
				playThroughEarpieceAndroid: false,
			});
		} catch (error) {
			console.error("Error initializing audio:", error);
		}
	},

	loadTrack: async (track: Track) => {
		const { sound: currentSound } = get();
		set({ isLoading: true });

		try {
			// Unload previous sound
			if (currentSound) {
				await currentSound.unloadAsync();
			}

			// Load new sound
			const { sound: newSound } = await Audio.Sound.createAsync(
				{ uri: track.uri },
				{ shouldPlay: false, volume: get().volume },
				(status) => {
					if (status.isLoaded) {
						// Smooth position updates - only update if significant change
						const currentPosition = get().position;
						const newPosition = status.positionMillis || 0;
						const positionDiff = Math.abs(
							newPosition - currentPosition
						);

						// Only update if difference is more than 500ms to avoid jittery updates
						if (positionDiff > 500) {
							set({
								position: newPosition,
								duration: status.durationMillis || 0,
								isPlaying: status.isPlaying || false,
								isLoading: status.isBuffering || false,
							});
						} else {
							// Just update duration and playing state, not position
							set({
								duration: status.durationMillis || 0,
								isPlaying: status.isPlaying || false,
								isLoading: status.isBuffering || false,
							});
						}

						// Handle playback completion
						if (status.didJustFinish && !status.isLooping) {
							get().handleTrackEnd();
						}
					}
				}
			);

			set({
				sound: newSound,
				currentTrack: track,
				isLoading: false,
			});
			await get().play(); // Tự động phát nhạc sau khi load
		} catch (error) {
			console.error("Error loading track:", error);
			set({ isLoading: false });
		}
	},

	play: async () => {
		const { sound } = get();
		if (sound) {
			try {
				await sound.playAsync();
				set({ isPlaying: true });
			} catch (error) {
				console.error("Error playing:", error);
			}
		}
	},

	pause: async () => {
		const { sound } = get();
		if (sound) {
			try {
				await sound.pauseAsync();
				set({ isPlaying: false });
			} catch (error) {
				console.error("Error pausing:", error);
			}
		}
	},

	seekTo: async (positionMillis: number) => {
		const { sound } = get();
		if (sound) {
			try {
				await sound.setPositionAsync(positionMillis);
				set({ position: positionMillis });
			} catch (error) {
				console.error("Error seeking:", error);
			}
		}
	},

	setVolume: async (volume: number) => {
		const { sound } = get();
		if (sound) {
			try {
				await sound.setVolumeAsync(volume);
				set({ volume });
			} catch (error) {
				console.error("Error setting volume:", error);
			}
		}
	},

	toggleFavorite: () => {
		set((state) => ({ isFavorite: !state.isFavorite }));
	},

	toggleShuffle: () => {
		set((state) => ({ isShuffle: !state.isShuffle }));
	},

	setRepeatMode: (mode: "off" | "all" | "one") => {
		set({ repeatMode: mode });
	},

	toggleRepeat: () => {
		const { repeatMode } = get();
		if (repeatMode === "off") {
			set({ repeatMode: "all" });
		} else if (repeatMode === "all") {
			set({ repeatMode: "one" });
		} else {
			set({ repeatMode: "off" });
		}
	},

	setQueue: (tracks: Track[]) => {
		set({ queue: tracks, currentIndex: 0 });
	},

	playNext: async () => {
		const { queue, currentIndex, isShuffle } = get();

		if (queue.length === 0) return;

		let nextIndex: number;
		if (isShuffle) {
			nextIndex = Math.floor(Math.random() * queue.length);
		} else {
			nextIndex = (currentIndex + 1) % queue.length;
		}

		set({ currentIndex: nextIndex });
		await get().loadTrack(queue[nextIndex]);
	},

	playPrevious: async () => {
		const { queue, currentIndex } = get();

		if (queue.length === 0) return;

		const prevIndex =
			currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
		set({ currentIndex: prevIndex });
		await get().loadTrack(queue[prevIndex]);
	},

	handleTrackEnd: async () => {
		const { repeatMode } = get();

		switch (repeatMode) {
			case "one":
				await get().seekTo(0);
				await get().play();
				break;
			case "all":
				await get().playNext();
				break;
			default:
				const { queue, currentIndex } = get();
				if (currentIndex < queue.length - 1) {
					await get().playNext();
				} else {
					set({ isPlaying: false, position: 0 });
				}
				break;
		}
	},

	updatePosition: (position: number) => {
		set({ position });
	},

	cleanup: async () => {
		const { sound } = get();
		if (sound) {
			try {
				await sound.unloadAsync();
			} catch (error) {
				console.error("Error cleaning up:", error);
			}
		}
		set({
			sound: null,
			currentTrack: null,
			isPlaying: false,
			position: 0,
		});
	},
}));

// Export types for use in components
export type { AudioState, Track };
