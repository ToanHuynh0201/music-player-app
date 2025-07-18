import { TextProps, TextStyle } from "react-native";

export type TypoProps = {
	size?: number;
	color?: string;
	fontWeight?: TextStyle["fontWeight"];
	children: any | null;
	style?: TextStyle;
	textProps?: TextProps;
};
