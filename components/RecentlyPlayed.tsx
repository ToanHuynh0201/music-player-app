import { COLOR_VARIANTS, COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
const { width } = Dimensions.get("window");

interface RecentlyPlayedItem {
	id: string;
	title: string;
	artist: string;
	image: string;
	duration: string;
}

interface RecentlyPlayedProps {
	data: RecentlyPlayedItem;
	onItemPress?: (item: RecentlyPlayedItem) => void;
	onPlayPress?: (item: RecentlyPlayedItem) => void;
	onSeeAllPress?: () => void;
}

const RecentlyPlayed = ({
	data,
	onItemPress,
	onPlayPress,
	onSeeAllPress,
}: RecentlyPlayedProps) => {
	return (
		<TouchableOpacity style={styles.recentItem} activeOpacity={0.7}>
			<Image source={{ uri: data.image }} style={styles.recentImage} />
			<View style={styles.recentInfo}>
				<Text style={styles.recentTitle} numberOfLines={1}>
					{data.title}
				</Text>
				<Text style={styles.recentArtist} numberOfLines={1}>
					{data.artist}
				</Text>
			</View>
			<TouchableOpacity style={styles.playButton}>
				<Ionicons name="play" size={16} color={COLORS.background} />
			</TouchableOpacity>
		</TouchableOpacity>
	);
};

export default RecentlyPlayed;

const styles = StyleSheet.create({
	recentItem: {
		backgroundColor: COLOR_VARIANTS.surface.light,
		borderRadius: 12,
		padding: 12,
		marginRight: 16,
		width: width * 0.8,
		flexDirection: "row",
		alignItems: "center",
	},
	recentImage: {
		width: 50,
		height: 50,
		borderRadius: 8,
	},
	recentInfo: {
		flex: 1,
		marginLeft: 12,
	},
	recentTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.textPrimary,
		marginBottom: 4,
	},
	recentArtist: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	playButton: {
		backgroundColor: COLORS.primary,
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
	},
});
