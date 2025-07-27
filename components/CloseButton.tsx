import { COLORS } from "@/constants/Colors";
import { CloseButtonProps } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
const CloseButton = ({ style, iconSize = 26 }: CloseButtonProps) => {
	const router = useRouter();
	return (
		<TouchableOpacity style={style} onPress={() => router.back()}>
			<AntDesign
				name="close"
				size={iconSize}
				color={COLORS.textPrimary}
			/>
		</TouchableOpacity>
	);
};

export default CloseButton;

const styles = StyleSheet.create({});
