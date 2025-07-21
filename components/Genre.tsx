import { COLORS } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
interface Genre {
	id: string;
	name: string;
	color: string;
}

interface GenreProps {
	genre: Genre;
	onGenrePress?: (genre: Genre) => void;
}
const Genre = ({ genre, onGenrePress }: GenreProps) => {
	return (
		<TouchableOpacity
			style={[styles.genreItem, { backgroundColor: genre.color }]}
			activeOpacity={0.8}
		>
			<Text style={styles.genreText}>{genre.name}</Text>
		</TouchableOpacity>
	);
};

export default Genre;

const styles = StyleSheet.create({
	genreItem: {
		flex: 1,
		height: 80,
		marginHorizontal: 6,
		marginVertical: 6,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	genreText: {
		fontSize: 16,
		fontWeight: "bold",
		color: COLORS.textPrimary,
	},
});
