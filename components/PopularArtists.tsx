import { COLORS } from "@/constants/Colors";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
interface Artist {
	id: string;
	name: string;
	image: string;
	followers: string;
}

interface PopularArtistsProps {
	data: Artist;
	onArtistPress?: (artist: Artist) => void;
	onSeeAllPress?: () => void;
}
const PopularArtists = ({
	data,
	onArtistPress,
	onSeeAllPress,
}: PopularArtistsProps) => {
	return (
		<TouchableOpacity
			style={styles.artistItem}
			activeOpacity={0.7}
			onPress={() => onArtistPress?.(data)}
		>
			<Image source={{ uri: data.image }} style={styles.artistImage} />
			<Text style={styles.artistName} numberOfLines={1}>
				{data.name}
			</Text>
			<Text style={styles.artistFollowers}>
				{data.followers} followers
			</Text>
		</TouchableOpacity>
	);
};

export default PopularArtists;

const styles = StyleSheet.create({
	artistItem: {
		alignItems: "center",
		marginRight: 20,
		width: 100,
	},
	artistImage: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 8,
	},
	artistName: {
		fontSize: 14,
		fontWeight: "600",
		color: COLORS.textPrimary,
		textAlign: "center",
		marginBottom: 4,
	},
	artistFollowers: {
		fontSize: 12,
		color: COLORS.textSecondary,
		textAlign: "center",
	},
});
