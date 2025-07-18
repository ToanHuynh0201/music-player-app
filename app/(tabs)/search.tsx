import Typo from "@/components/Typo";
import React from "react";
import { StyleSheet, View } from "react-native";

const Search = () => {
	return (
		<View style={styles.container}>
			<Typo>Search</Typo>
		</View>
	);
};

export default Search;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
	},
});
