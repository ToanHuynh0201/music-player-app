import { COLOR_VARIANTS, COLORS, GRADIENTS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface HomeHeaderProps {
	onProfilePress?: () => void;
}
const HomeHeader = ({ onProfilePress }: HomeHeaderProps) => {
	const [greeting, setGreeting] = useState("");
	useEffect(() => {
		const hour = new Date().getHours();
		if (hour < 12) {
			setGreeting("Chào buổi sáng");
		} else if (hour < 18) {
			setGreeting("Chào buổi chiều");
		} else {
			setGreeting("Chào buổi tối");
		}
	}, []);
	return (
		<LinearGradient
			colors={GRADIENTS.playerBackground}
			style={styles.header}
		>
			<View style={styles.headerContent}>
				<View>
					<Text style={styles.greeting}>{greeting}</Text>
					<Text style={styles.userName}>Music Lover</Text>
				</View>
				<TouchableOpacity
					style={styles.profileButton}
					onPress={onProfilePress}
				>
					<Ionicons
						name="person-circle"
						size={32}
						color={COLORS.textPrimary}
					/>
				</TouchableOpacity>
			</View>
		</LinearGradient>
	);
};

export default HomeHeader;

const styles = StyleSheet.create({
	header: {
		backgroundColor: COLORS.primary,
		paddingTop: 50,
		paddingHorizontal: 20,
		paddingBottom: 30,
	},
	headerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	greeting: {
		fontSize: 16,
		color: COLOR_VARIANTS.text.secondary,
		fontWeight: "400",
	},
	userName: {
		fontSize: 24,
		color: COLOR_VARIANTS.text.primary,
		fontWeight: "bold",
		marginTop: 4,
	},
	profileButton: {
		padding: 4,
	},
});
