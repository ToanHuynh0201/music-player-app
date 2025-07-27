import { COLORS } from "@/constants/Colors";
import { useAudioStore } from "@/stores/audioStore";
import { Foundation } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SkipButtonProps = {
	name: keyof typeof Foundation.glyphMap;
	onPress?: () => void;
	currentTrack?: any; // Replace with actual track type
};

type PlayPauseButtonProps = {
	onPress?: () => void;
	fontSize?: number;
	currentTrack?: any; // Replace with actual track type
	isPlaying?: boolean;
	isLoading?: boolean;
};

const ControlButton = () => {
	const {
		currentTrack,
		isPlaying,
		isLoading,
		play,
		pause,
		playNext,
		playPrevious,
	} = useAudioStore();

	const handlePlayPause = async () => {
		if (isPlaying) {
			await pause();
		} else {
			await play();
		}
	};

	return (
		<View style={styles.container}>
			<SkipButton
				name="previous"
				onPress={playPrevious}
				currentTrack={currentTrack}
			/>
			<PlayPauseButton
				onPress={handlePlayPause}
				currentTrack={currentTrack}
				isPlaying={isPlaying}
				isLoading={isLoading}
			/>
			<SkipButton
				name="next"
				onPress={playNext}
				currentTrack={currentTrack}
			/>
		</View>
	);
};

export const PlayPauseButton = ({
	onPress,
	fontSize = 48,
	currentTrack,
	isPlaying,
	isLoading,
}: PlayPauseButtonProps) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={!currentTrack || isLoading}
		>
			{isLoading ? (
				<Text style={[styles.playPauseIcon, { fontSize: fontSize }]}>
					⏳
				</Text>
			) : isPlaying ? (
				<Foundation
					name="pause"
					style={styles.playPauseIcon}
					size={fontSize}
					color={COLORS.textPrimary}
				/>
			) : (
				<Foundation
					name="play"
					style={styles.playPauseIcon}
					size={fontSize}
					color={COLORS.textPrimary}
				/>
			)}
		</TouchableOpacity>
	);
};

export const SkipButton = ({
	name,
	onPress,
	currentTrack,
}: SkipButtonProps) => {
	return (
		<TouchableOpacity onPress={onPress} disabled={!currentTrack}>
			<Foundation
				name={name}
				style={[
					styles.controlIcon,
					{ opacity: currentTrack ? 1 : 0.5 },
				]}
				size={48}
				color={COLORS.textPrimary}
			/>
		</TouchableOpacity>
	);
};

export default ControlButton;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
	},
	playPauseIcon: {
		marginHorizontal: 16,
		paddingHorizontal: 8,
	},
	controlIcon: {
		marginHorizontal: 32,
	},
});
