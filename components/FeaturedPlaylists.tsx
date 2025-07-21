import { COLOR_VARIANTS, COLORS } from "@/constants/Colors";
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
interface Playlist {
	id: string;
	title: string;
	description: string;
	image: string;
	songs: number;
}

interface FeaturedPlaylistsProps {
	data: Playlist;
	onPlaylistPress?: (playlist: Playlist) => void;
	onSeeAllPress?: () => void;
}
const FeaturedPlaylists = ({
	data,
	onPlaylistPress,
	onSeeAllPress,
}: FeaturedPlaylistsProps) => {
	return (
		<TouchableOpacity
			style={styles.playlistItem}
			activeOpacity={0.7}
			onPress={() => onPlaylistPress?.(data)}
		>
			<Image source={{ uri: data.image }} style={styles.playlistImage} />
			<View style={styles.playlistInfo}>
				<Text style={styles.playlistTitle} numberOfLines={1}>
					{data.title}
				</Text>
				<Text style={styles.playlistDescription} numberOfLines={2}>
					{data.description}
				</Text>
				<Text style={styles.playlistSongs}>{data.songs} bài hát</Text>
			</View>
		</TouchableOpacity>
	);
};

export default FeaturedPlaylists;

const styles = StyleSheet.create({
	playlistItem: {
		backgroundColor: COLOR_VARIANTS.surface.light,
		borderRadius: 12,
		padding: 12,
		marginRight: 16,
		width: width * 0.7,
		flexDirection: "row",
	},
	playlistImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
	},
	playlistInfo: {
		flex: 1,
		marginLeft: 12,
		justifyContent: "space-between",
	},
	playlistTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: COLORS.textPrimary,
		marginBottom: 4,
	},
	playlistDescription: {
		fontSize: 13,
		color: COLORS.textSecondary,
		lineHeight: 18,
		marginBottom: 8,
	},
	playlistSongs: {
		fontSize: 12,
		color: COLORS.textSecondary,
		fontWeight: "500",
	},
});
