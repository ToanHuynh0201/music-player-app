import { COLORS, GRADIENTS } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
	cover: "https://upload.wikimedia.org/wikipedia/vi/5/5d/Em_c%E1%BB%A7a_ng%C3%A0y_h%C3%B4m_qua.png",
	duration: 210, // seconds
};

const Player = () => {
	const router = useRouter();
	const [isPlaying, setIsPlaying] = useState(true);
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const [progress, setProgress] = useState(40);
	const [isFavorite, setIsFavorite] = useState(false);
	const [isShuffle, setIsShuffle] = useState(false);
	const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

	useEffect(() => {
		const loadSound = async () => {
			const { sound } = await Audio.Sound.createAsync(
				{
					uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
				}, // Thay bằng link nhạc của bạn
				{ shouldPlay: true }
			);
			setSound(sound);
		};
		loadSound();

		return () => {
			sound && sound.unloadAsync();
		};
	}, []);

	const handlePlayPause = async () => {
		if (!sound) return;
		if (isPlaying) {
			await sound.pauseAsync();
		} else {
			await sound.playAsync();
		}
		setIsPlaying(!isPlaying);
	};

	const handleFavorite = () => setIsFavorite((prev) => !prev);
	const handleShuffle = () => setIsShuffle((prev) => !prev);
	const handleRepeat = () => {
		setRepeatMode((prev) => {
			if (prev === "off") return "all";
			if (prev === "all") return "one";
			return "off";
		});
	};

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
					{isShuffle ? (
						<Entypo
							name="shuffle"
							size={30}
							color={COLORS.primary}
						/>
					) : (
						<Entypo
							name="shuffle"
							size={30}
							color={COLORS.textPrimary}
						/>
					)}
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleRepeat}
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
					value={progress}
					minimumValue={0}
					maximumValue={song.duration}
					onValueChange={setProgress}
					minimumTrackTintColor={COLORS.accent}
					maximumTrackTintColor={COLORS.textSecondary}
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
					<Foundation
						name="previous"
						style={styles.controlIcon}
						size={48}
						color={COLORS.textPrimary}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={handlePlayPause}>
					{isPlaying ? (
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
				<TouchableOpacity>
					<Foundation
						name="next"
						style={styles.controlIcon}
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
	playPauseIcon: {
		fontSize: 48,
		color: COLORS.accent,
		marginHorizontal: 24,
	},
});
