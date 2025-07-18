import Typo from "@/components/Typo";
import React from "react";
import { StyleSheet, View } from "react-native";

const Library = () => {
	return (
		<View style={styles.container}>
			<Typo>Library</Typo>
		</View>
	);
};

export default Library;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
	},
});
