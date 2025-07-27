import { COLORS } from "@/constants/Colors";
import { TypoProps } from "@/types";
import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

const Typo = ({
	size,
	color = COLORS.textPrimary,
	fontWeight = "400",
	children,
	style,
	textProps = {},
}: TypoProps) => {
	const textStyle: TextStyle = {
		fontSize: size ? size : 20,
		color,
		fontWeight,
	};

	return (
		<Text style={[style, textStyle]} {...textProps}>
			{children}
		</Text>
	);
};

export default Typo;

const styles = StyleSheet.create({});
