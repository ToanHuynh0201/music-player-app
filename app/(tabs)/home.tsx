import Typo from "@/components/Typo";
import React from "react";
import { StyleSheet, View } from "react-native";

const Home = () => {
	return (
		<View style={styles.container}>
			<Typo>Home</Typo>
		</View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
	},
});
