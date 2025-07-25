import { COLORS, GRADIENTS } from "@/constants/Colors";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const { width } = Dimensions.get("window");

// Dummy data
const song = {
	title: "Em của ngày hôm qua",
	artist: "Sơn Tùng M-TP",
	cover: "https://i1.sndcdn.com/artworks-000072857012-4v7k7w-t500x500.jpg",
	duration: 210, // seconds
};

const Player = () => {
	const router = useRouter();
	const [isPlaying, setIsPlaying] = useState(true);
	const [progress, setProgress] = useState(40);
	const [isFavorite, setIsFavorite] = useState(false);
	const [isShuffle, setIsShuffle] = useState(false);
	const [isRepeat, setIsRepeat] = useState(false);

	const handlePlayPause = () => setIsPlaying((prev) => !prev);
	const handleFavorite = () => setIsFavorite((prev) => !prev);
	const handleShuffle = () => setIsShuffle((prev) => !prev);
	const handleRepeat = () => setIsRepeat((prev) => !prev);

	const handleClose = () => router.back();

	const formatTime = (sec: number) => {
		const m = Math.floor(sec / 60);
		const s = Math.floor(sec % 60);
		return `${m}:${s < 10 ? "0" : ""}${s}`;
	};

	return (
		<LinearGradient
			colors={GRADIENTS.playerBackground}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			{/* Close button */}
			<TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
				<Text style={styles.closeText}>✕</Text>
			</TouchableOpacity>

			{/* Cover Art */}
			<Image source={{ uri: song.cover }} style={styles.cover} />

			{/* Song Info */}
			<View style={styles.info}>
				<Text style={styles.title}>{song.title}</Text>
				<Text style={styles.artist}>{song.artist}</Text>
			</View>

			{/* Action Buttons */}
			<View style={styles.actionRow}>
				<TouchableOpacity
					onPress={handleFavorite}
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
					onPress={handleShuffle}
					style={styles.actionBtn}
				>
					<Text
						style={[
							styles.actionIcon,
							{
								color: isShuffle
									? COLORS.primary
									: COLORS.textSecondary,
							},
						]}
					>
						🔀
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleRepeat}
					style={styles.actionBtn}
				>
					<Text
						style={[
							styles.actionIcon,
							{
								color: isRepeat
									? COLORS.primary
									: COLORS.textSecondary,
							},
						]}
					>
						🔁
					</Text>
				</TouchableOpacity>
			</View>

			{/* Progress Bar */}
			<View style={styles.progressContainer}>
				<Slider
					style={styles.slider}
					value={progress}
					minimumValue={0}
					maximumValue={song.duration}
					onValueChange={setProgress}
					minimumTrackTintColor={COLORS.accent}
					maximumTrackTintColor={COLORS.border}
					thumbTintColor={COLORS.primary}
				/>
				<View style={styles.timeRow}>
					<Text style={styles.time}>{formatTime(progress)}</Text>
					<Text style={styles.time}>{formatTime(song.duration)}</Text>
				</View>
			</View>

			{/* Controls */}
			<View style={styles.controls}>
				<TouchableOpacity>
					<Text style={styles.controlIcon}>⏮️</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handlePlayPause}>
					<Text style={styles.playPauseIcon}>
						{isPlaying ? "⏸️" : "▶️"}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text style={styles.controlIcon}>⏭️</Text>
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
		top: 48,
		right: 24,
		zIndex: 10,
		padding: 8,
	},
	closeText: {
		fontSize: 24,
		color: COLORS.textPrimary,
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
	},
	artist: {
		fontSize: 16,
		color: COLORS.textSecondary,
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
	},
	timeRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	time: {
		color: COLORS.textSecondary,
		fontSize: 12,
	},
	controls: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		width: "80%",
		marginTop: 16,
	},
	controlIcon: {
		fontSize: 36,
		color: COLORS.primary,
	},
	playPauseIcon: {
		fontSize: 48,
		color: COLORS.accent,
		marginHorizontal: 24,
	},
});
