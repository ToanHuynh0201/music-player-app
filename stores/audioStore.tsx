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

	initializeAudio: async () => {
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			staysActiveInBackground: true,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			playThroughEarpieceAndroid: false,
		});
	},

	loadTrack: async (track: Track) => {
		set({ isLoading: true });
		const prevSound = get().sound;
		if (prevSound) {
			await prevSound.unloadAsync();
		}
		const { sound } = await Audio.Sound.createAsync(
			{ uri: track.uri },
			{ shouldPlay: false }
		);
		sound.setOnPlaybackStatusUpdate((status) => {
			if (status.isLoaded) {
				set({
					position: status.positionMillis || 0,
					duration: status.durationMillis || 0,
					isPlaying: status.isPlaying || false,
					isLoading: status.isBuffering || false,
				});
			}
		});
		set({
			sound,
			currentTrack: track,
			isLoading: false,
			position: 0,
			duration: track.duration * 1000,
			isPlaying: false,
		});
	},

	play: async () => {
		const sound = get().sound;
		if (sound) {
			await sound.playAsync();
			set({ isPlaying: true });
		}
	},

	pause: async () => {
		const sound = get().sound;
		if (sound) {
			await sound.pauseAsync();
			set({ isPlaying: false });
		}
	},

	seekTo: async (positionMillis: number) => {
		const sound = get().sound;
		if (sound) {
			await sound.setPositionAsync(positionMillis);
			set({ position: positionMillis });
		}
	},

	setVolume: async (volume: number) => {
		const sound = get().sound;
		if (sound) {
			await sound.setVolumeAsync(volume);
			set({ volume });
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
		set((state) => ({
			repeatMode:
				state.repeatMode === "off"
					? "one"
					: state.repeatMode === "one"
					? "all"
					: "off",
		}));
	},

	setQueue: (tracks: Track[]) => {
		set({ queue: tracks });
	},

	playNext: async () => {
		// Chưa xử lý, để rỗng hoặc thêm logic sau
	},

	playPrevious: async () => {
		// Chưa xử lý, để rỗng hoặc thêm logic sau
	},

	handleTrackEnd: async () => {
		// Chưa xử lý, để rỗng hoặc thêm logic sau
	},

	updatePosition: (position: number) => {
		set({ position });
	},

	cleanup: async () => {
		const sound = get().sound;
		if (sound) {
			await sound.unloadAsync();
			set({ sound: null });
		}
	},
}));

// Export types for use in components
export type { AudioState, Track };
