// app/(modals)/player.tsx
import CloseButton from "@/components/CloseButton";
import { COLORS, GRADIENTS } from "@/constants/Colors";
import { Track, useAudioStore } from "@/stores/audioStore";
import Entypo from "@expo/vector-icons/Entypo";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const { width } = Dimensions.get("window");

const Player = () => {
	const router = useRouter();

	// Zustand store
	const {
		currentTrack,
		isPlaying,
		isLoading,
		position,
		duration,
		isFavorite,
		isShuffle,
		repeatMode,
		play,
		pause,
		seekTo,
		toggleFavorite,
		toggleShuffle,
		toggleRepeat,
		playNext,
		playPrevious,
		updatePosition,
		initializeAudio,
		loadTrack,
	} = useAudioStore();

	// Local state for slider to avoid conflicts
	const [sliderValue, setSliderValue] = useState(0);
	const [isSliding, setIsSliding] = useState(false);

	// Refs for smooth position updates - FIXED TYPE
	const intervalRef = useRef<number | null>(null);
	const positionRef = useRef<number>(0);

	useEffect(() => {
		initializeAudio();

		// Load default track if none is loaded
		if (!currentTrack) {
			const defaultTrack: Track = {
				id: "1",
				title: "Em của ngày hôm qua",
				artist: "Sơn Tùng M-TP",
				cover: "https://upload.wikimedia.org/wikipedia/vi/5/5d/Em_c%E1%BB%A7a_ng%C3%A0y_h%C3%B4m_qua.png",
				uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
				duration: 210, // seconds
			};
			loadTrack(defaultTrack);
		}

		// Cleanup interval on unmount
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	// Update slider value when position changes (but not while sliding)
	useEffect(() => {
		if (!isSliding) {
			const positionInSeconds = position / 1000;
			setSliderValue(positionInSeconds);
			positionRef.current = positionInSeconds;
		}
	}, [position, isSliding]);

	// Smooth position updates using requestAnimationFrame approach
	useEffect(() => {
		// Clear existing interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		if (currentTrack && isPlaying && !isSliding) {
			// Use shorter interval for smoother updates
			intervalRef.current = setInterval(async () => {
				try {
					const sound = useAudioStore.getState().sound;
					if (sound) {
						const status = await sound.getStatusAsync();
						if (status.isLoaded) {
							const newPositionMs = status.positionMillis || 0;
							const newPositionSeconds = newPositionMs / 1000;

							// Only update if there's a meaningful difference (> 0.5 seconds)
							const currentPositionSeconds = positionRef.current;
							const diff = Math.abs(
								newPositionSeconds - currentPositionSeconds
							);

							if (diff === 1 || newPositionMs === 0) {
								updatePosition(newPositionMs);
								positionRef.current = newPositionSeconds;

								// Update slider value smoothly
								setSliderValue(newPositionSeconds);
							} else {
								// Smooth interpolation for small updates
								// const interpolatedPosition =
								// 	currentPositionSeconds + 0.5;
								// setSliderValue(interpolatedPosition);
								// positionRef.current = interpolatedPosition;
							}
						}
					}
				} catch (error) {
					console.error("Error updating position:", error);
				}
			}, 500) as number; // Type assertion here
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isPlaying, isSliding, currentTrack]);

	const handlePlayPause = async () => {
		if (isPlaying) {
			await pause();
		} else {
			await play();
		}
	};

	const handleSliderStart = () => {
		setIsSliding(true);
		// Clear interval while sliding
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	const handleSliderChange = (value: number) => {
		setSliderValue(value);
		positionRef.current = value;
	};

	const handleSliderComplete = async (value: number) => {
		setIsSliding(false);
		await seekTo(value * 1000); // Convert to milliseconds

		// Resume position updates after seeking
		if (isPlaying) {
			// Small delay to ensure seek is complete
			setTimeout(() => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
				// Restart the interval
				if (currentTrack && isPlaying) {
					intervalRef.current = setInterval(async () => {
						try {
							const sound = useAudioStore.getState().sound;
							if (sound) {
								const status = await sound.getStatusAsync();
								if (status.isLoaded) {
									const newPositionMs =
										status.positionMillis || 0;
									updatePosition(newPositionMs);
									if (!isSliding) {
										setSliderValue(newPositionMs / 1000);
										positionRef.current =
											newPositionMs / 1000;
									}
								}
							}
						} catch (error) {
							console.error("Error updating position:", error);
						}
					}, 500) as number; // Type assertion here too
				}
			}, 100);
		}
	};

	const handleClose = () => router.back();

	const formatTime = (sec: number): string => {
		const minutes = Math.floor(sec / 60);
		const seconds = Math.floor(sec % 60);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};

	// Use current track data or fallback
	const trackData = currentTrack || {
		title: "No track loaded",
		artist: "Unknown",
		cover: "https://via.placeholder.com/300x300?text=No+Cover",
		duration: 0,
	};

	const trackDurationSeconds = duration
		? Math.floor(duration / 1000)
		: trackData.duration;

	return (
		<LinearGradient
			colors={GRADIENTS.playerBackground}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			{/* Close button */}
			<CloseButton style={styles.closeBtn} iconSize={30} />

			{/* Cover Art */}
			<Image source={{ uri: trackData.cover }} style={styles.cover} />

			{/* Song Info */}
			<View style={styles.info}>
				<Text style={styles.title}>{trackData.title}</Text>
				<Text style={styles.artist}>{trackData.artist}</Text>
			</View>

			{/* Action Buttons */}
			<View style={styles.actionRow}>
				<TouchableOpacity
					onPress={toggleFavorite}
					style={styles.actionBtn}
				>
					<Text
						style={[
							styles.actionIcon,
							{
								color: isFavorite
									? COLORS.accent
									: COLORS.textSecondary,
							},
						]}
					>
						{isFavorite ? "❤️" : "🤍"}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={toggleShuffle}
					style={styles.actionBtn}
				>
					<Entypo
						name="shuffle"
						size={30}
						color={isShuffle ? COLORS.primary : COLORS.textPrimary}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={toggleRepeat}
					style={styles.actionBtn}
				>
					{repeatMode === "off" && (
						<MaterialIcons
							name="repeat"
							size={34}
							color={COLORS.textPrimary}
						/>
					)}
					{repeatMode === "all" && (
						<MaterialIcons
							name="repeat"
							size={34}
							color={COLORS.primary}
						/>
					)}
					{repeatMode === "one" && (
						<MaterialIcons
							name="repeat-one"
							size={34}
							color={COLORS.primary}
						/>
					)}
				</TouchableOpacity>
			</View>

			{/* Progress Bar */}
			<View style={styles.progressContainer}>
				<Slider
					style={styles.slider}
					value={sliderValue}
					minimumValue={0}
					maximumValue={trackDurationSeconds}
					onSlidingStart={handleSliderStart}
					onValueChange={handleSliderChange}
					onSlidingComplete={handleSliderComplete}
					minimumTrackTintColor={COLORS.accent}
					maximumTrackTintColor={COLORS.textSecondary}
					thumbTintColor={COLORS.primary}
					disabled={!currentTrack}
				/>
				<View style={styles.timeRow}>
					<Text style={styles.time}>{formatTime(sliderValue)}</Text>
					<Text style={styles.time}>
						{formatTime(trackDurationSeconds)}
					</Text>
				</View>
			</View>

			{/* Controls */}
			<View style={styles.controls}>
				<TouchableOpacity
					onPress={playPrevious}
					disabled={!currentTrack}
				>
					<Foundation
						name="previous"
						style={[
							styles.controlIcon,
							{ opacity: currentTrack ? 1 : 0.5 },
						]}
						size={48}
						color={COLORS.textPrimary}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={handlePlayPause}
					disabled={!currentTrack || isLoading}
				>
					{isLoading ? (
						<Text style={[styles.controlIcon, { fontSize: 48 }]}>
							⏳
						</Text>
					) : isPlaying ? (
						<Foundation
							name="pause"
							style={styles.controlIcon}
							size={48}
							color={COLORS.textPrimary}
						/>
					) : (
						<Foundation
							name="play"
							style={styles.controlIcon}
							size={48}
							color={COLORS.textPrimary}
						/>
					)}
				</TouchableOpacity>

				<TouchableOpacity onPress={playNext} disabled={!currentTrack}>
					<Foundation
						name="next"
						style={[
							styles.controlIcon,
							{ opacity: currentTrack ? 1 : 0.5 },
						]}
						size={48}
						color={COLORS.textPrimary}
					/>
				</TouchableOpacity>
			</View>
		</LinearGradient>
	);
};

export default Player;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
		backgroundColor: COLORS.background,
	},
	closeBtn: {
		position: "absolute",
		top: 24,
		right: 24,
		zIndex: 10,
		padding: 8,
	},
	cover: {
		width: width * 0.7,
		height: width * 0.7,
		borderRadius: 20,
		marginBottom: 32,
		marginTop: 60,
		backgroundColor: COLORS.surface,
	},
	info: {
		alignItems: "center",
		marginBottom: 24,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: COLORS.textPrimary,
		marginBottom: 8,
		textAlign: "center",
	},
	artist: {
		fontSize: 16,
		color: COLORS.textSecondary,
		textAlign: "center",
	},
	actionRow: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
		gap: 32,
	},
	actionBtn: {
		padding: 8,
	},
	actionIcon: {
		fontSize: 28,
	},
	progressContainer: {
		width: "100%",
		marginBottom: 24,
	},
	slider: {
		width: "100%",
		height: 40,
		color: COLORS.textPrimary,
	},
	timeRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	time: {
		color: COLORS.textSecondary,
		fontSize: 16,
		marginHorizontal: 12,
	},
	controls: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "80%",
		marginTop: 16,
	},
	controlIcon: {
		marginHorizontal: 32,
	},
});
