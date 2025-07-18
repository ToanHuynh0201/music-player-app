import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const index = () => {
	const router = useRouter();
	return (
		<View>
			<Text>index</Text>
		</View>
	);
};

export default index;

const styles = StyleSheet.create({});
